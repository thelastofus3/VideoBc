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
export function SceneComponent({userEmail, roomCode}) {
    function Loader() {
        const {progress} = useProgress()
        return <Html center>{progress.toFixed(2)} % loaded</Html>
    }

    const tvRefs = {
        local: useRef(),
        remote: useRef(),
    };

    const videoRef = useRef(null);
    const [videoTexture, setVideoTexture] = useState(null);

    const tvModel = useLoader(GLTFLoader, `${import.meta.env.BASE_URL}tv_gs.gltf`);

    const localTVPos = useControls("Local TV", {
        x: { value: -20, min: -50, max: 50, step: 0.1 },
        y: { value: -6.4, min: -20, max: 20, step: 0.1 },
        z: { value: 2.7, min: -20, max: 20, step: 0.1 },
    });

    const remoteTVPos = useControls("Remote TV", {
        x: { value: -18.7, min: -50, max: 50, step: 0.1 },
        y: { value: -7.6, min: -20, max: 20, step: 0.1 },
        z: { value: 0.7, min: -20, max: 20, step: 0.1 },
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
        const screenMesh = tvModel.scene.getObjectByName("Screen"); // Имя объекта внутри GLTF, замени на своё
        if (screenMesh) {
            screenMesh.material = new THREE.MeshBasicMaterial({map: videoTexture});
        }
    }, [tvModel, videoTexture]);

    return (
        <div id="canvas-container">
            <Leva collapsed={false}/>
            <AgoraMonitorApp tvRefs={tvRefs} userEmail={userEmail} roomCode={roomCode}/>
            <Canvas>
                <Suspense fallback={<Loader/>}>
                    <PerspectiveCamera
                        makeDefault
                        fov={65}
                        aspect={window.innerWidth / window.innerHeight}
                        position={[-13, -4, 0]}
                        far={1500}
                        near={0.1}
                    />
                    <primitive
                        object={tvModel.scene.clone()}
                        key={1}
                        ref={tvRefs.local}
                        position={[localTVPos.x, localTVPos.y, localTVPos.z]}
                        rotation={[0, Math.PI / 3.4, 0]}
                        children-0-castShadow
                    />
                    <primitive
                        object={tvModel.scene.clone()}
                        key={2}
                        ref={tvRefs.remote}
                        position={[remoteTVPos.x, remoteTVPos.y, remoteTVPos.z]}
                        rotation={[0, Math.PI / 2.2, 0]}
                        scale={[1.7, 1.7, 1.7]}
                        children-0-castShadow
                    />
                    <GaussianSplatViewer/>
                    <Player/>
                    <Environment preset="sunset" background/>
                </Suspense>
            </Canvas>
        </div>
    )
}