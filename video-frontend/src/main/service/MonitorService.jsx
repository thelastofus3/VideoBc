import * as THREE from "three";

export class MonitorService {
    constructor() {
        this.originalMaterials = new Map();
    }

    updateMonitorTexture(videoElement, monitorRef) {
        if (!monitorRef.current) return;

        const videoTexture = new THREE.VideoTexture(videoElement);
        videoTexture.flipY = false;

        monitorRef.current.traverse((node) => {
            if (node.isMesh && node.material.name === 'ScreenOn') {
                // Store original material if not already saved
                if (!this.originalMaterials.has(monitorRef)) {
                    this.originalMaterials.set(monitorRef, node.material.clone());
                }

                node.material = new THREE.MeshBasicMaterial({
                    map: videoTexture,
                    name: 'ScreenOn'
                });
                node.material.needsUpdate = true;
            }
        });
    }

    clearMonitorTexture(monitorRef) {
        if (!monitorRef.current) return;

        const originalMaterial = this.originalMaterials.get(monitorRef);
        if (!originalMaterial) return;

        monitorRef.current.traverse((node) => {
            if (node.isMesh && node.material.name === 'ScreenOn') {
                node.material = originalMaterial.clone();
                node.material.needsUpdate = true;
            }
        });
    }

    createVideoElement(videoTrack) {
        const videoElement = document.createElement("video");
        videoTrack.play(videoElement);
        return videoElement;
    }
}