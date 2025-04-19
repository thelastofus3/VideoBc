import React, {useEffect, useMemo, useRef} from 'react';
import {useFrame, useThree} from "@react-three/fiber";
import {Vector3} from "three";
import {PointerLockControls} from "@react-three/drei";


export const Player = () => {
    const {camera} = useThree();
    const playerVelocity = useMemo(() => new Vector3(), []);
    const playerDirection = useMemo(() => new Vector3(), []);
    const keys = useRef({});

    const handleKeyDown = (e) => {
        keys.current[e.code] = true;
    };

    const handleKeyUp = (e) => {
        keys.current[e.code] = false;
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    const movePlayer = (delta) => {
        const speed = 30;
        const direction = new Vector3();

        if (keys.current["KeyW"]) {
            camera.getWorldDirection(playerDirection);
            playerDirection.y = 0;
            playerDirection.normalize();
            direction.add(playerDirection);
        }

        if (keys.current["KeyS"]) {
            camera.getWorldDirection(playerDirection);
            playerDirection.y = 0;
            playerDirection.normalize();
            direction.add(playerDirection.negate());
        }

        if (keys.current["KeyA"]) {
            camera.getWorldDirection(playerDirection);
            playerDirection.y = 0;
            playerDirection.normalize();
            playerDirection.cross(camera.up);
            direction.add(playerDirection.negate());
        }

        if (keys.current["KeyD"]) {
            camera.getWorldDirection(playerDirection);
            playerDirection.y = 0;
            playerDirection.normalize();
            playerDirection.cross(camera.up);
            direction.add(playerDirection);
        }

        direction.normalize();
        playerVelocity.add(direction.multiplyScalar(speed * delta));
    };

    useFrame((_, delta) => {
        movePlayer(delta);

        camera.position.add(playerVelocity.clone().multiplyScalar(delta));

        playerVelocity.multiplyScalar(0.9);

    });

    return (
        <>
            <PointerLockControls/>
        </>
    );
};