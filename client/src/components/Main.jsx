import React, { useEffect, useRef } from "react";
import * as THREE from "three"; // Essential for Box3, Vector3, Color
// Import RoomEnvironment and PMREMGenerator to set up the default environment lighting
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { PMREMGenerator } from "three";

import { loadCar } from "../../src/components/car";
import { setupScene } from "../../src/components/scene";
import useSpoiler from "../../src/components/spoiler";
import useTyreLoader from "../components/tyres";
import useCarColor from "../../src/components/color"; // 🎨 hook to apply color

export default function Main({
  selectedCar,
  selectedSpoiler, // <-- This receives user choices OR the recommended value
  selectedTyre,    // <-- This receives user choices OR the recommended value
  carColor,       // <-- This receives user choices OR the recommended value
}) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const loaderRef = useRef(null);
  const objectRef = useRef(null);
  const composerRef = useRef(null); 
  const spoilerVisibleRef = useRef(false); 
  const carLoadedRef = useRef(false); 

  // 🏗 Setup Scene (Initializes Renderer, Camera, Controls, and Composer)
  useEffect(() => {
    const { 
      renderer, 
      composer, 
      cleanup, 
      updateLightsForCar, 
      normalizeCarMaterials 
    } = setupScene(
      containerRef,
      sceneRef,
      cameraRef,
      rendererRef,
      controlsRef,
      loaderRef
    );

    composerRef.current = composer; 
    containerRef.current.updateLightsForCar = updateLightsForCar;
    containerRef.current.normalizeCarMaterials = normalizeCarMaterials; 

    let pmremGenerator = null;
    let envMap = null;

    // ✅ Fix for HDR Lights: Setup Environment Map (using RoomEnvironment as a fallback)
    if (sceneRef.current && renderer) {
      pmremGenerator = new PMREMGenerator(renderer);
      envMap = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      sceneRef.current.environment = envMap; // This provides the HDR-like reflections
      sceneRef.current.background = new THREE.Color(0x101010);
    }
    
    // ✅ Ensure canvas and composer resize correctly
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      rendererRef.current.setSize(width, height);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      composerRef.current?.setSize(width, height); // Ensure post-processing effects resize
    };
    window.addEventListener("resize", handleResize);


    return () => {
      cleanup?.();
      // Clean up resources
      if (envMap) envMap.dispose();
      if (pmremGenerator) pmremGenerator.dispose();
      window.removeEventListener("resize", handleResize);

      if (containerRef.current && rendererRef.current) {
        try {
          containerRef.current.removeChild(rendererRef.current.domElement);
        } catch (e) {
          console.warn("Renderer domElement already removed");
        }
      }
      carLoadedRef.current = false; 
    };
  }, []); // Runs only once for setup

// ---
  // 🚗 Load car when selectedCar changes
  useEffect(() => {
    if (!loaderRef.current || !sceneRef.current) return;

    loadCar(
      loaderRef.current,
      sceneRef.current,
      cameraRef.current,
      controlsRef.current,
      objectRef,
      selectedCar,
      (obj) => { // onLoadComplete: Run after positioning
        if (!obj) return;

        objectRef.current = obj; 
        carLoadedRef.current = true; // Signal load complete

        // Step 1: Material tweaks
        if (containerRef.current.normalizeCarMaterials) {
          containerRef.current.normalizeCarMaterials(obj, selectedCar);
        }

        // Step 2: Lights/shadows + HDRI adjustment (This calls the light setup function)
        if (containerRef.current.updateLightsForCar && rendererRef.current && composerRef.current) {
          const finalBox = new THREE.Box3().setFromObject(obj);
          const finalSize = new THREE.Vector3();
          finalBox.getSize(finalSize);
          const finalCenter = new THREE.Vector3();
          finalBox.getCenter(finalCenter);

          console.log(`📐 Car loaded for ${selectedCar}: Size (${finalSize.x.toFixed(2)}, ${finalSize.y.toFixed(2)}, ${finalSize.z.toFixed(2)}), Center:`, finalCenter);

          const bloomPass = composerRef.current.passes[1];
          containerRef.current.updateLightsForCar(
            finalCenter, 
            finalSize, 
            selectedCar, 
            rendererRef.current, 
            bloomPass
          );
        }

        console.log(`✅ Reflections & shadows adjusted for ${selectedCar} (HDRI + material tweaks applied)`);
      }
    );
  }, [selectedCar]); 

// ---
  // 🎨 Apply color (This handles the base color and the recommended color from P2)
  useCarColor({ 
    carRef: objectRef, 
    color: carColor, // <-- Passes the color, including any recommended color hex
    selectedCar,
    enabled: carLoadedRef.current 
  });

  // 🪶 Load spoiler (This handles user selection and P3 recommendation)
  useSpoiler({
    sceneRef,
    objectRef,
    loaderRef,
    selectedSpoiler, // <-- Passes "spoiler1", "spoiler2", OR "P3_Recommended_Spoiler"
    selectedCar,
    spoilerVisibleRef,
    cameraRef,
    controlsRef, 
    cameraDistance: 4, 
    focusHeight: 2.5, 
    smoothTransition: true, 
    sideOffset: 1.5, 
    overviewHeight: 5, 
    enablePerCarTuning: true, 
    minCameraDistance: 3, 
    manualScale: { x: 1.2, y: 1, z: 0.9 }, 
  });
    
  // 🛞 Tyre loader (This handles user selection and P1 recommendation)
  useTyreLoader({ 
    sceneRef, 
    objectRef, 
    loaderRef, 
    selectedTyre, // <-- Passes "tyre1", "tyre2", "tyre3", OR "P1_Recommended_Tyre"
    selectedCar 
});

  return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />;
}

