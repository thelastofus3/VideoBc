import React, {useEffect, useState, useRef} from 'react';
import * as THREE from "three";
import AgoraRTC from "agora-rtc-react";
import {agoraConfig, cameraConfig} from "../../config.jsx";
import styles from '../styles/Main.module.scss';
import {useNavigate} from "react-router-dom";

export const AgoraMonitorApp = ({tvRefs, userEmail, roomCode}) => {
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

    // Ref to store the original default material of the screen mesh
    const originalRemoteMaterial = useRef(null);

    const updateMonitorTexture = (videoElement, monitor) => {
        if (!monitor.current) return;
        const videoTexture = new THREE.VideoTexture(videoElement);
        videoTexture.flipY = false;

        monitor.current.traverse((node) => {
            if (node.isMesh && node.material.name === 'ScreenOn') {
                // Save the original material for reset
                if (!originalRemoteMaterial.current) {
                    originalRemoteMaterial.current = node.material.clone();
                }
                node.material = new THREE.MeshBasicMaterial({ map: videoTexture, name: 'ScreenOn' });
                node.material.needsUpdate = true;
            }
        });
    };

    // Clears the video texture and restores the original material
    const clearMonitorTexture = (monitor) => {
        if (!monitor.current || !originalRemoteMaterial.current) return;
        monitor.current.traverse((node) => {
            if (node.isMesh && node.material.name === 'ScreenOn') {
                node.material = originalRemoteMaterial.current.clone();
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

    const joinChannel = async () => {
        try {
            await rtc.client.join(
                options.appId,
                roomCode || options.channel,
                options.token,
                options.uid
            );
            await createAndPublishLocalTracks();
            displayLocalVideo();
            setIsJoined(true);
        } catch (error) {
            console.error("Error joining channel:", error);
        }
    };

    const leaveChannel = async () => {
        await rtc.client?.leave();
        rtc.localAudioTrack?.close();
        rtc.localVideoTrack?.close();
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

    const setupEventListeners = (client) => {
        client.on("user-published", async (user, mediaType) => {
            await client.subscribe(user, mediaType);
            if (mediaType === "video") {
                setRemoteUsers(prev => prev.includes(user.uid) ? prev : [...prev, user]);
                displayRemoteVideo(user, tvRefs.remote);
            }
            if (mediaType === "audio") {
                user.audioTrack?.play();
            }
        });

        client.on("user-unpublished", (user, mediaType) => {
            setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
            if (mediaType === 'video') {
                clearMonitorTexture(tvRefs.remote);
            }
        });
    };

    useEffect(() => {
        rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        setupEventListeners(rtc.client);
        return () => {
            rtc.localAudioTrack?.close();
            rtc.localVideoTrack?.close();
            rtc.client?.leave();
        };
    }, []);

    return (
        <div className={`${styles.phoneOverlay} flex flex-col items-center justify-between`}>
            <div className={`${styles.phoneScreen} flex flex-col items-center justify-between p-4 bg-gray-200 border rounded-md shadow-md`}>
                <div className={`${styles.emailHeader} text-center py-2`}>{userEmail}</div>
                <div className={styles.participantsList}>
                    <h3>Participants ({remoteUsers.length + 1})</h3>
                </div>
                {isJoined ? (
                    <button onClick={leaveChannel} className={`${styles.leaveButton}`}>Leave Call</button>
                ) : (
                    <button onClick={joinChannel} className={`${styles.joinButton}`}>Join Call</button>
                )}
                <button onClick={toggleCamera} className={`${styles.micAndCameraButton} ${!isCameraOn ? styles.redButton : ''}`}>Camera</button>
                <button onClick={toggleMic} className={`${styles.micAndCameraButton} ${!isMicOn ? styles.redButton : ''}`}>Mic</button>
            </div>
        </div>
    );
};