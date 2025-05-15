import {agoraConfig} from "../../config.jsx";
import {useEffect, useState} from "react";
import {MonitorService} from "../service/MonitorService.jsx";
import {BackendService} from "../service/BackendService.jsx";
import {AgoraService} from "../service/AgoraService.jsx";

export const useVideoCall = (tvRefs, roomCode) => {
    const [agoraService] = useState(() => new AgoraService(
        agoraConfig.appId,
        agoraConfig.channel,
        agoraConfig.token,
        agoraConfig.uid
    ).initialize());

    const [backendService] = useState(() => new BackendService());
    const [monitorService] = useState(() => new MonitorService());

    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [remoteUsers, setRemoteUsers] = useState([]);
    const [isJoined, setIsJoined] = useState(false);
    const [role, setRole] = useState(null); // "host" | "audience"
    const [error, setError] = useState(null);

    useEffect(() => {
        agoraService.registerEventHandlers({
            onRemoteUsersChanged: (users) => {
                setRemoteUsers(users);
            },
            onError: (errorMsg) => {
                setError(errorMsg);
            }
        });

        return () => {
            handleLeaveCall();
        };
    }, []);

    useEffect(() => {
        if (isJoined) {
            updateDisplays();
        }
    }, [remoteUsers, role, isJoined]);

    useEffect(() => {
        const handleBeforeUnload = async (e) => {
            if (isJoined && role === "host") {
                await backendService.unregisterFromBackend(
                    roomCode,
                    role,
                    agoraService.getUid()
                );
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isJoined, role]);

    const updateDisplays = () => {
        // Clear monitors
        monitorService.clearMonitorTexture(tvRefs.remote);
        if (role === "audience") {
            monitorService.clearMonitorTexture(tvRefs.local);
        }

        // Display videos based on role
        if (role === "audience") {
            if (remoteUsers.length >= 1) {
                const videoElement = monitorService.createVideoElement(remoteUsers[0].videoTrack);
                monitorService.updateMonitorTexture(videoElement, tvRefs.remote);
            }
            if (remoteUsers.length >= 2) {
                const videoElement = monitorService.createVideoElement(remoteUsers[1].videoTrack);
                monitorService.updateMonitorTexture(videoElement, tvRefs.local);
            }
        }
        else if (role === "host") {
            // Display local video
            if (agoraService.getLocalVideoTrack()) {
                const localVideoElement = monitorService.createVideoElement(agoraService.getLocalVideoTrack());
                monitorService.updateMonitorTexture(localVideoElement, tvRefs.local);
            }

            // Display remote video if available
            if (remoteUsers.length >= 1) {
                const videoElement = monitorService.createVideoElement(remoteUsers[0].videoTrack);
                monitorService.updateMonitorTexture(videoElement, tvRefs.remote);
            }
        }
    };

    const handleJoinCall = async (selectedRole) => {
        try {
            setError(null);

            // Register with backend if joining as host
            if (selectedRole === "host") {
                try {
                    await backendService.registerWithBackend(
                        roomCode,
                        selectedRole,
                        agoraService.getUid()
                    );
                } catch (err) {
                    setError(err.message);
                    return;
                }
            }

            // Join Agora channel
            const success = await agoraService.joinChannel(selectedRole, roomCode);
            if (!success) return;

            setRole(selectedRole);
            setIsJoined(true);

            // Update displays
            if (selectedRole === "host") {
                const localVideoElement = monitorService.createVideoElement(agoraService.getLocalVideoTrack());
                monitorService.updateMonitorTexture(localVideoElement, tvRefs.local);
            }
        } catch (err) {
            setError("Failed to join: " + err.message);
            if (selectedRole === "host") {
                await backendService.unregisterFromBackend(
                    roomCode,
                    selectedRole,
                    agoraService.getUid()
                );
            }
        }
    };

    const handleLeaveCall = async () => {
        if (role === "host") {
            await backendService.unregisterFromBackend(
                roomCode,
                role,
                agoraService.getUid()
            );
        }

        await agoraService.leaveChannel();
        monitorService.clearMonitorTexture(tvRefs.remote);
        monitorService.clearMonitorTexture(tvRefs.local);

        setRemoteUsers([]);
        setIsJoined(false);
        setRole(null);
        setError(null);
    };

    const handleToggleCamera = async () => {
        const newState = await agoraService.toggleCamera(isCameraOn);
        setIsCameraOn(newState);
    };

    const handleToggleMic = async () => {
        const newState = await agoraService.toggleMic(isMicOn);
        setIsMicOn(newState);
    };

    const handleToggleScreenShare = async () => {
        try {
            if (isScreenSharing) {
                await agoraService.stopScreenShare();
                setIsScreenSharing(false);
            } else {
                await agoraService.startScreenShare();
                setIsScreenSharing(true);
            }

            // Update local display
            if (role === "host") {
                const localVideoElement = monitorService.createVideoElement(agoraService.getLocalVideoTrack());
                monitorService.updateMonitorTexture(localVideoElement, tvRefs.local);
            }
        } catch (err) {
            setError("Screen sharing error: " + err.message);
        }
    };

    return {
        isJoined,
        isCameraOn,
        isMicOn,
        isScreenSharing,
        remoteUsers,
        role,
        error,
        joinCall: handleJoinCall,
        leaveCall: handleLeaveCall,
        toggleCamera: handleToggleCamera,
        toggleMic: handleToggleMic,
        toggleScreenShare: handleToggleScreenShare
    };
};