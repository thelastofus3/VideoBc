import AgoraRTC from "agora-rtc-react";
import {cameraConfig} from "../../config.jsx";

export class AgoraService {
    constructor(appId, channel, token, uid) {
        this.options = {
            appId,
            channel,
            token,
            uid
        };

        this.client = null;
        this.localAudioTrack = null;
        this.localVideoTrack = null;
        this.remoteUsers = [];
        this.isScreenSharing = false;

        this.eventHandlers = {
            onUserJoined: () => {},
            onUserLeft: () => {},
            onRemoteUsersChanged: () => {},
            onError: () => {}
        };
    }

    initialize() {
        this.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
        this._setupEventListeners();
        return this;
    }

    registerEventHandlers(handlers) {
        this.eventHandlers = { ...this.eventHandlers, ...handlers };
        return this;
    }

    async joinChannel(role, roomCode) {
        try {
            await this.client.setClientRole(role);
            await this.client.join(
                this.options.appId,
                roomCode || this.options.channel,
                this.options.token,
                this.options.uid
            );

            if (role === "host") {
                await this._createAndPublishLocalTracks();
            }

            return true;
        } catch (error) {
            this.eventHandlers.onError("Failed to join the channel: " + error.message);
            return false;
        }
    }

    async leaveChannel() {
        this.localAudioTrack?.close();
        this.localVideoTrack?.close();
        await this.client?.leave();
        this.remoteUsers = [];
    }

    async toggleCamera(isCameraOn) {
        if (this.localVideoTrack) {
            await this.localVideoTrack.setEnabled(!isCameraOn);
            return !isCameraOn;
        }
        return isCameraOn;
    }

    async toggleMic(isMicOn) {
        if (this.localAudioTrack) {
            await this.localAudioTrack.setEnabled(!isMicOn);
            return !isMicOn;
        }
        return isMicOn;
    }

    async startScreenShare() {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const screenTrack = AgoraRTC.createCustomVideoTrack({
                mediaStreamTrack: screenStream.getVideoTracks()[0]
            });

            if (this.localVideoTrack) {
                await this.client.unpublish(this.localVideoTrack);
                this.localVideoTrack.stop();
                this.localVideoTrack.close();
            }

            this.localVideoTrack = screenTrack;
            await this.client.publish([this.localVideoTrack]);
            this.isScreenSharing = true;

            screenStream.getVideoTracks()[0].addEventListener('ended', async () => {
                await this.stopScreenShare();
            });

            return this.localVideoTrack;
        } catch (err) {
            this.eventHandlers.onError("Error starting screen share: " + err.message);
            return null;
        }
    }

    async stopScreenShare() {
        if (this.localVideoTrack) {
            await this.client.unpublish(this.localVideoTrack);
            this.localVideoTrack.stop();
            this.localVideoTrack.close();
        }

        this.localVideoTrack = await AgoraRTC.createCameraVideoTrack(cameraConfig);
        await this.client.publish([this.localVideoTrack]);
        this.isScreenSharing = false;

        return this.localVideoTrack;
    }

    getLocalVideoTrack() {
        return this.localVideoTrack;
    }

    getRemoteUsers() {
        return this.remoteUsers;
    }

    isScreenSharingActive() {
        return this.isScreenSharing;
    }

    getUid() {
        return this.options.uid;
    }

    async _createAndPublishLocalTracks() {
        this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        this.localVideoTrack = await AgoraRTC.createCameraVideoTrack(cameraConfig);
        await this.client.publish([this.localAudioTrack, this.localVideoTrack]);
        return {
            audioTrack: this.localAudioTrack,
            videoTrack: this.localVideoTrack
        };
    }

    _setupEventListeners() {
        this.client.on("user-published", async (user, mediaType) => {
            await this.client.subscribe(user, mediaType);

            if (mediaType === "video") {
                this.remoteUsers = [
                    ...this.remoteUsers.filter(u => u.uid !== user.uid),
                    user
                ];
                this.eventHandlers.onRemoteUsersChanged(this.remoteUsers);
            }

            if (mediaType === "audio") {
                user.audioTrack?.play();
            }

            this.eventHandlers.onUserJoined(user);
        });

        this.client.on("user-unpublished", (user, mediaType) => {
            if (mediaType === "video") {
                this.remoteUsers = this.remoteUsers.filter(u => u.uid !== user.uid);
                this.eventHandlers.onRemoteUsersChanged(this.remoteUsers);
            }

            this.eventHandlers.onUserLeft(user);
        });
    }
}