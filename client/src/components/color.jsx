// color.jsx
import { useEffect } from "react";
import * as THREE from "three";

/**
 * Hook to update or reset the car body color without reloading the model.
 *
 * @param {object} carRef - Ref of the loaded car object
 * @param {string|null} color - Hex color string (e.g. "#ff0000"), or null/"default" to reset
 */
export default function useCarColor({ carRef, color }) {
  useEffect(() => {
    if (!carRef.current) return;

    carRef.current.traverse((child) => {
      if (!child.isMesh) return;

      const name = child.name.toLowerCase();

      // Match likely car body meshes
      if (name.includes("body")) {
        const mat = child.material;

        // Store original color only once
        if (!child.userData.originalColor && mat?.color) {
          child.userData.originalColor = mat.color.clone();
        }

        // Clone material so each car instance has its own
        const newMat = mat.clone();

        // Reset to original
        if (!color || color === "default") {
          if (child.userData.originalColor) {
            newMat.color.copy(child.userData.originalColor);
          }
        } 
        // Apply new color tint
        else if (
          newMat.isMeshStandardMaterial ||
          newMat.isMeshPhysicalMaterial ||
          newMat.isMeshPhongMaterial ||
          newMat.isMeshLambertMaterial ||
          newMat.isMeshBasicMaterial
        ) {
          newMat.color = new THREE.Color(color);

          // Preserve textures
          if (newMat.map) {
            newMat.map.encoding = THREE.sRGBEncoding;
            newMat.map.needsUpdate = true;
          }

          if (newMat.emissive) newMat.emissive.set(0x000000);
          if (newMat.vertexColors) newMat.vertexColors = false;
        }

        newMat.needsUpdate = true;
        child.material = newMat;
      }
    });
  }, [carRef, color]);
}
