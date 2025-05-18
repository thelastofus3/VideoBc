import React, {useEffect} from 'react';
import * as THREE from "three";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import {useThree} from "@react-three/fiber";

export const GaussianSplatViewer = ({ splatPath }) => {
    const { scene } = useThree();

    console.log("In room:", splatPath)
    const transforms = splatPath === 'B601.splat'
        ? { posX: 0, posY: 0, posZ: 0, scale: 1, rotX: 0, rotY: 0, rotZ: 0 }
        : { posX: -15, posY: -6.5, posZ: 1, scale: 5, rotX: Math.PI, rotY: 0, rotZ: 0 };

    useEffect(() => {
        const viewer = new GaussianSplats3D.DropInViewer({
            dynamicScene: true,
        });

        const quaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(transforms.rotX, transforms.rotY, transforms.rotZ));

        viewer.addSplatScenes(
            [
                {
                    path: `${import.meta.env.BASE_URL}${splatPath}`,
                    splatAlphaRemovalThreshold: 10,
                    position: [transforms.posX, transforms.posY, transforms.posZ],
                    scale: [transforms.scale, transforms.scale, transforms.scale],
                    rotation: quaternion.toArray(),
                },
            ],
            true
        );

        scene.add(viewer);

        return () => {
            scene.remove(viewer);
        };
    }, [scene, splatPath]);

    return null;
};