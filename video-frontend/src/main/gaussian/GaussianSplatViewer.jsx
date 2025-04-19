import React, {useEffect} from 'react';
import * as THREE from "three";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import {useThree} from "@react-three/fiber";

export const GaussianSplatViewer = () => {
    const {scene} = useThree();

    useEffect(() => {
        const viewer = new GaussianSplats3D.DropInViewer({
            dynamicScene: true,
        });

        viewer.addSplatScenes(
            [
                {
                    path: `${import.meta.env.BASE_URL}B601.splat`,
                    splatAlphaRemovalThreshold: 10,
                    rotation: new THREE.Quaternion()
                        .setFromUnitVectors(
                            new THREE.Vector3(0, 0, 0).normalize(),
                            new THREE.Vector3(0, 0, 0)
                        )
                        .toArray(),
                },
            ],
            true
        );

        scene.add(viewer);

        return () => {
            scene.remove(viewer);
        };
    }, [scene]);

    return null;
};