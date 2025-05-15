import {Canvas, useLoader} from "@react-three/fiber";
import {Environment, Html, PerspectiveCamera, useProgress} from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {Suspense, useEffect, useRef, useState} from "react";
import {GaussianSplatViewer} from "../gaussian/GaussianSplatViewer.jsx";
import {Player} from "../player/Player.jsx";
import {AgoraMonitorApp} from "./AgoraMonitorApp.jsx";
import {Leva, useControls} from "leva";
import * as THREE from "three";

// eslint-disable-next-line react/prop-types
export function SceneComponent({ userEmail, roomCode, splatPath }) {
    function Loader() {
        const { progress } = useProgress();
        return <Html center>{progress.toFixed(2)} % loaded</Html>;
    }

    const tvRefs = { local: useRef(), remote: useRef() };
    const videoRef = useRef(null);
    const [videoTexture, setVideoTexture] = useState(null);
    const tvModel = useLoader(GLTFLoader, `${import.meta.env.BASE_URL}tv_gs.gltf`);

    const roomPresets = {
        B601: {
            localTV: { x: -20, y: -6.4, z: 2.7, scale: 1, rotationY: Math.PI / 3.4 },
            remoteTV: { x: -18.7, y: -7.6, z: 0.7, scale: 1.7, rotationY: Math.PI / 2.2 },
        },
        B405: {
            localTV: { x: -22, y: -6, z: 3, scale: 1.3, rotationY: Math.PI / 3.2 },
            remoteTV: { x: -21, y: -7, z: 1, scale: 1.9, rotationY: Math.PI / 2.1 },
        },
        default: {
            localTV: { x: 0, y: 0, z: 0, scale: 1, rotationY: 0 },
            remoteTV: { x: 0, y: 0, z: 0, scale: 1, rotationY: 0 },
        },
    };

    const roomName = splatPath.replace('.splat', '');
    const defaults = roomPresets[roomName] || roomPresets.default;

    const localTV = useControls('Local TV', {
        x: { value: defaults.localTV.x, min: -50, max: 50, step: 0.1 },
        y: { value: defaults.localTV.y, min: -20, max: 20, step: 0.1 },
        z: { value: defaults.localTV.z, min: -20, max: 20, step: 0.1 },
        scale: { value: defaults.localTV.scale, min: 0.1, max: 5, step: 0.1 },
        rotationY: { value: defaults.localTV.rotationY, min: 0, max: Math.PI * 2, step: 0.01 },
    });

    const remoteTV = useControls('Remote TV', {
        x: { value: defaults.remoteTV.x, min: -50, max: 50, step: 0.1 },
        y: { value: defaults.remoteTV.y, min: -20, max: 20, step: 0.1 },
        z: { value: defaults.remoteTV.z, min: -20, max: 20, step: 0.1 },
        scale: { value: defaults.remoteTV.scale, min: 0.1, max: 5, step: 0.1 },
        rotationY: { value: defaults.remoteTV.rotationY, min: 0, max: Math.PI * 2, step: 0.01 },
    });

    useEffect(() => {
        if (videoRef.current) {
            const texture = new THREE.VideoTexture(videoRef.current);
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.format = THREE.RGBFormat;
            setVideoTexture(texture);
        }
    }, []);

    useEffect(() => {
        if (!tvModel || !videoTexture) return;
        const screenMesh = tvModel.scene.getObjectByName('Screen');
        if (screenMesh) screenMesh.material = new THREE.MeshBasicMaterial({ map: videoTexture });
    }, [tvModel, videoTexture]);

    return (
        <div id="canvas-container">
            <Leva collapsed={false} />
            <AgoraMonitorApp tvRefs={tvRefs} userEmail={userEmail} roomCode={roomCode} />
            <Canvas>
                <Suspense fallback={<Loader />}>
                    <PerspectiveCamera makeDefault fov={65} aspect={window.innerWidth / window.innerHeight} position={[-13, -4, 0]} far={1500} near={0.1} />

                    <primitive
                        object={tvModel.scene.clone()}
                        ref={tvRefs.local}
                        position={[localTV.x, localTV.y, localTV.z]}
                        rotation={[0, localTV.rotationY, 0]}
                        scale={[localTV.scale, localTV.scale, localTV.scale]}
                    />

                    <primitive
                        object={tvModel.scene.clone()}
                        ref={tvRefs.remote}
                        position={[remoteTV.x, remoteTV.y, remoteTV.z]}
                        rotation={[0, remoteTV.rotationY, 0]}
                        scale={[remoteTV.scale, remoteTV.scale, remoteTV.scale]}
                    />

                    <GaussianSplatViewer splatPath={splatPath} />
                    <Player />
                    <Environment preset="sunset" background />
                </Suspense>
            </Canvas>
        </div>
    );
}