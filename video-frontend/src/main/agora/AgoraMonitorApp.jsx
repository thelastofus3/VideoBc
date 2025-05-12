import React, { useEffect, useState, useRef } from 'react';
import * as THREE from "three";
import AgoraRTC from "agora-rtc-react";
import { agoraConfig, cameraConfig } from "../../config.jsx";
import styles from '../styles/Main.module.scss';
import { useNavigate } from "react-router-dom";

export const AgoraMonitorApp = ({ tvRefs, userEmail, roomCode }) => {
    const [rtc] = useState({
        localAudioTrack: null,
        localVideoTrack: null,
        client: null,
    });

    const navigate = useNavigate();
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [remoteUsers, setRemoteUsers] = useState([]);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isJoined, setIsJoined] = useState(false);
    const [options] = useState(agoraConfig);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [role, setRole] = useState(null); // "host" | "audience"

    const originalRemoteMaterial = useRef(null);
    const originalLocalMaterial = useRef(null);

    const updateMonitorTexture = (videoElement, monitor) => {
        if (!monitor.current) return;
        const videoTexture = new THREE.VideoTexture(videoElement);
        videoTexture.flipY = false;

        monitor.current.traverse((node) => {
            if (node.isMesh && node.material.name === 'ScreenOn') {
                if (monitor === tvRefs.remote && !originalRemoteMaterial.current) {
                    originalRemoteMaterial.current = node.material.clone();
                } else if (monitor === tvRefs.local && !originalLocalMaterial.current) {
                    originalLocalMaterial.current = node.material.clone();
                }
                node.material = new THREE.MeshBasicMaterial({ map: videoTexture, name: 'ScreenOn' });
                node.material.needsUpdate = true;
            }
        });
    };

    const clearMonitorTexture = (monitor) => {
        if (!monitor.current) return;

        const originalMaterial = monitor === tvRefs.remote
            ? originalRemoteMaterial.current
            : originalLocalMaterial.current;

        if (!originalMaterial) return;

        monitor.current.traverse((node) => {
            if (node.isMesh && node.material.name === 'ScreenOn') {
                node.material = originalMaterial.clone();
                node.material.needsUpdate = true;
            }
        });
    };

    const displayRemoteVideo = (user, monitorRef) => {
        const remoteVideoTrack = user.videoTrack;
        const remoteVideoElement = document.createElement("video");
        remoteVideoTrack.play(remoteVideoElement);
        updateMonitorTexture(remoteVideoElement, monitorRef);
    };

    const displayLocalVideo = () => {
        const localVideoElement = document.createElement("video");
        rtc.localVideoTrack.play(localVideoElement);
        updateMonitorTexture(localVideoElement, tvRefs.local);
    };

    const createAndPublishLocalTracks = async () => {
        rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack(cameraConfig);
        await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
    };

    const joinChannel = async (selectedRole) => {
        try {
            setRole(selectedRole);
            await rtc.client.setClientRole(selectedRole);
            await rtc.client.join(
                options.appId,
                roomCode || options.channel,
                options.token,
                options.uid
            );

            if (selectedRole === "host") {
                await createAndPublishLocalTracks();
                displayLocalVideo();
            }

            setIsJoined(true);
        } catch (error) {
            console.error("Error joining channel:", error);
        }
    };

    const leaveChannel = async () => {
        await rtc.client?.leave();
        rtc.localAudioTrack?.close();
        rtc.localVideoTrack?.close();
        clearMonitorTexture(tvRefs.remote);
        clearMonitorTexture(tvRefs.local);
        setRemoteUsers([]);
        setIsJoined(false);
        setRole(null);
        navigate("/");
    };

    const toggleCamera = async () => {
        if (rtc.localVideoTrack) {
            await rtc.localVideoTrack.setEnabled(!isCameraOn);
            setIsCameraOn(!isCameraOn);
        }
    };

    const toggleMic = async () => {
        if (rtc.localAudioTrack) {
            await rtc.localAudioTrack.setEnabled(!isMicOn);
            setIsMicOn(!isMicOn);
        }
    };

    const startScreenShare = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const screenTrack = AgoraRTC.createCustomVideoTrack({ mediaStreamTrack: screenStream.getVideoTracks()[0] });

            if (rtc.localVideoTrack) {
                await rtc.client.unpublish(rtc.localVideoTrack);
                rtc.localVideoTrack.stop();
                rtc.localVideoTrack.close();
            }

            rtc.localVideoTrack = screenTrack;
            await rtc.client.publish([rtc.localVideoTrack]);
            displayLocalVideo();
            setIsScreenSharing(true);

            screenStream.getVideoTracks()[0].addEventListener('ended', async () => {
                await stopScreenShare();
            });
        } catch (err) {
            console.error("Error starting screen share:", err);
        }
    };

    const stopScreenShare = async () => {
        if (rtc.localVideoTrack) {
            await rtc.client.unpublish(rtc.localVideoTrack);
            rtc.localVideoTrack.stop();
            rtc.localVideoTrack.close();
        }

        rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack(cameraConfig);
        await rtc.client.publish([rtc.localVideoTrack]);
        displayLocalVideo();
        setIsScreenSharing(false);
    };

    const toggleScreenShare = async () => {
        if (isScreenSharing) {
            await stopScreenShare();
        } else {
            await startScreenShare();
        }
    };

    // Function to update display of remote users based on count and role
    const updateRemoteDisplays = () => {
        // Clear both displays first
        clearMonitorTexture(tvRefs.remote);
        if (role === "audience") {
            clearMonitorTexture(tvRefs.local);
        }

        // For audience members, display up to two remote streams
        if (role === "audience") {
            if (remoteUsers.length >= 1) {
                displayRemoteVideo(remoteUsers[0], tvRefs.remote);
            }
            if (remoteUsers.length >= 2) {
                displayRemoteVideo(remoteUsers[1], tvRefs.local);
            }
        }
        // For hosts, just show the first remote user on remote display
        else if (role === "host" && remoteUsers.length >= 1) {
            displayRemoteVideo(remoteUsers[0], tvRefs.remote);
        }
    };

    // Update displays whenever remote users or role changes
    useEffect(() => {
        if (isJoined) {
            updateRemoteDisplays();
        }
    }, [remoteUsers, role, isJoined]);

    const setupEventListeners = (client) => {
        client.on("user-published", async (user, mediaType) => {
            await client.subscribe(user, mediaType);
            if (mediaType === "video") {
                setRemoteUsers(prev => {
                    if (prev.some(u => u.uid === user.uid)) return prev;
                    return [...prev, user];
                });
                // Display logic moved to useEffect with updateRemoteDisplays
            }
            if (mediaType === "audio") {
                user.audioTrack?.play();
            }
        });

        client.on("user-unpublished", (user, mediaType) => {
            if (mediaType === "video") {
                setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
                // Removing display logic from here, updateRemoteDisplays will handle it
            }
        });
    };

    useEffect(() => {
        rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
        setupEventListeners(rtc.client);
        return () => {
            rtc.localAudioTrack?.close();
            rtc.localVideoTrack?.close();
            rtc.client?.leave();
            clearMonitorTexture(tvRefs.remote);
            clearMonitorTexture(tvRefs.local);
        };
    }, []);

    return (
        <div className={`${styles.phoneOverlay} flex flex-col items-center justify-between`}>
            <div className={`${styles.phoneScreen} flex flex-col items-center justify-between p-4 bg-gray-200 border rounded-md shadow-md`}>
                <div className={`${styles.emailHeader} text-center py-2`}>{userEmail}</div>
                <div className={styles.participantsList}>
                    <h3>Participants ({remoteUsers.length + (role === "host" ? 1 : 0)})</h3>
                </div>

                {isJoined ? (
                    <>
                        <button onClick={leaveChannel} className={`${styles.leaveButton}`}>Leave Call</button>
                        {role === "host" && (
                            <>
                                <button onClick={toggleCamera} className={`${styles.micAndCameraButton} ${!isCameraOn ? styles.redButton : ''}`}>Camera</button>
                                <button onClick={toggleMic} className={`${styles.micAndCameraButton} ${!isMicOn ? styles.redButton : ''}`}>Mic</button>
                                <button onClick={toggleScreenShare} className={`${styles.micAndCameraButton} ${isScreenSharing ? styles.redButton : ''}`}>
                                    {isScreenSharing ? "Stop Screen Share" : "Start Screen Share"}
                                </button>
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => joinChannel("host")}
                            className={`${styles.joinButton}`}
                        >
                            Join as Host
                        </button>
                        <button
                            onClick={() => joinChannel("audience")}
                            className={`${styles.joinButton}`}
                        >
                            Join as Audience
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};