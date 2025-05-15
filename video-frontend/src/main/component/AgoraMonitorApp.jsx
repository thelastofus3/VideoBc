import React from 'react';
import styles from '../styles/Main.module.scss';
import { useNavigate } from "react-router-dom";
import {useVideoCall} from "../hook/useVideoCall.jsx";

export const AgoraMonitorApp = ({ tvRefs, userEmail, roomCode }) => {
    const navigate = useNavigate();

    const {
        isJoined,
        isCameraOn,
        isMicOn,
        isScreenSharing,
        remoteUsers,
        role,
        error,
        joinCall,
        leaveCall,
        toggleCamera,
        toggleMic,
        toggleScreenShare
    } = useVideoCall(tvRefs, roomCode);

    const handleLeaveCall = async () => {
        await leaveCall();
        navigate("/");
    };

    return (
        <div className={`${styles.phoneOverlay} flex flex-col items-center justify-between`}>
            <div className={`${styles.phoneScreen} flex flex-col items-center justify-between p-4 bg-gray-200 border rounded-md shadow-md`}>
                <div className={`${styles.emailHeader} text-center py-2`}>{userEmail}</div>

                <div className={styles.participantsList}>
                    <h3>Participants ({remoteUsers.length})</h3>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {isJoined ? (
                    <>
                        <button onClick={handleLeaveCall} className={`${styles.leaveButton}`}>
                            Leave Call
                        </button>

                        {role === "host" && (
                            <>
                                <button
                                    onClick={toggleCamera}
                                    className={`${styles.micAndCameraButton} ${!isCameraOn ? styles.redButton : ''}`}
                                >
                                    Camera
                                </button>

                                <button
                                    onClick={toggleMic}
                                    className={`${styles.micAndCameraButton} ${!isMicOn ? styles.redButton : ''}`}
                                >
                                    Mic
                                </button>

                                <button
                                    onClick={toggleScreenShare}
                                    className={`${styles.micAndCameraButton} ${isScreenSharing ? styles.redButton : ''}`}
                                >
                                    {isScreenSharing ? "Stop Screen Share" : "Start Screen Share"}
                                </button>
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => joinCall("host")}
                            className={`${styles.joinButton}`}
                        >
                            Join as Host
                        </button>

                        <button
                            onClick={() => joinCall("audience")}
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