import {Canvas, useLoader} from "@react-three/fiber";
import {Environment, Html, PerspectiveCamera, useProgress} from "@react-three/drei";
import {GaussianSplatViewer} from "./gaussian/GaussianSplatViewer.jsx";
import {Player} from "./player/Player.jsx";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {Suspense, useEffect, useRef, useState} from "react";
import {AgoraMonitorApp} from "./agora/AgoraMonitorApp.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {userService} from "./service/MainService.jsx";

export function App() {
    const { roomCode } = useParams();
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await userService.getUser();
                setUserEmail(response.data.email);
            } catch (error) {
                console.log("Error while getting user email" ,error);
                navigate('/login')
            }
        };

        fetchData();
    }, []);

    function Loader() {
        const {progress} = useProgress()
        return <Html center>{progress} % loaded</Html>
    }

    const tvRefs = {
        local: useRef(),
        remote: useRef(),
    };
    console.log(import.meta.env.BASE_URL)
    const tvModel = useLoader(GLTFLoader, `${import.meta.env.BASE_URL}tv_gs.gltf`);

    return (
        <div id="canvas-container">
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
                        position={[-20, -6.4, 2.7]}
                        rotation={[0, Math.PI / 3.4, 0]}
                        children-0-castShadow
                    />
                    <primitive
                        object={tvModel.scene.clone()}
                        key={2}
                        ref={tvRefs.remote}
                        position={[-18.7, -7.6, 0.7]}
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