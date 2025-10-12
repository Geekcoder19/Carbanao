import React, { useEffect, useRef } from "react";
import * as THREE from "three"; // 🔥 For Box3/Vector3 in post-load
import { loadCar } from "../../src/components/car";
import { setupScene } from "../../src/components/scene";
import useSpoiler from "../../src/components/spoiler";
import useTyreLoader from "../components/tyres";
import useCarColor from "../../src/components/color"; // 🎨 hook to apply color

export default function Main({
  selectedCar,
  selectedSpoiler,
  selectedTyre,
  carColor, // 🎨 receive color from parent (explore.jsx)
}) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const loaderRef = useRef(null);
  const objectRef = useRef(null);
  const composerRef = useRef(null); // 🔥 For accessing bloomPass
  const spoilerVisibleRef = useRef(false); // Fixed: Initialize to false
  const carLoadedRef = useRef(false); // Gate color after load

  // 🏗 Setup Scene (destructure helpers for lighting, shadows & reflections)
  useEffect(() => {
    const { 
      renderer, 
      composer, 
      cleanup, 
      updateLightsForCar,  // 🔥 For shadows + HDRI reflections (scene.environmentIntensity)
      normalizeCarMaterials  // 🔥 For material reflections (envMapIntensity + roughness tweaks)
    } = setupScene(
      containerRef,
      sceneRef,
      cameraRef,
      rendererRef,
      controlsRef,
      loaderRef
    );

    // Store refs/helpers
    composerRef.current = composer; // For bloomPass access
    containerRef.current.updateLightsForCar = updateLightsForCar;
    containerRef.current.normalizeCarMaterials = normalizeCarMaterials; // 🔥 Reflections on materials

    return () => {
      cleanup?.();
      if (containerRef.current && rendererRef.current) {
        try {
          containerRef.current.removeChild(rendererRef.current.domElement);
        } catch (e) {
          console.warn("Renderer domElement already removed");
        }
      }
      carLoadedRef.current = false; // Reset on cleanup
    };
  }, []);

  // 🚗 Load car when selectedCar changes (with onLoadComplete for shadows/reflections)
  useEffect(() => {
    if (!loaderRef.current || !sceneRef.current) return;

    loadCar(
      loaderRef.current,
      sceneRef.current,
      cameraRef.current,
      controlsRef.current,
      objectRef,
      selectedCar,
      (obj) => { // 🔥 onLoadComplete: Run after positioning
        if (!obj) return;

        objectRef.current = obj; // Ensure ref is set
        carLoadedRef.current = true; // Signal load complete

        // Step 1: Material tweaks (🔥 Reflections: Boost envMapIntensity/roughness for Jimny body/rims)
        if (containerRef.current.normalizeCarMaterials) {
          containerRef.current.normalizeCarMaterials(obj, selectedCar);
        }

        // Step 2: Lights/shadows + HDRI (🔥 Reflections: scene.environmentIntensity=1.5; Shadows: softer for Jimny)
        if (containerRef.current.updateLightsForCar && rendererRef.current && composerRef.current) {
          const finalBox = new THREE.Box3().setFromObject(obj);
          const finalSize = new THREE.Vector3();
          finalBox.getSize(finalSize);
          const finalCenter = new THREE.Vector3();
          finalBox.getCenter(finalCenter);

          // Log for debugging (e.g., car size/center)
          console.log(`📐 Car loaded for ${selectedCar}: Size (${finalSize.x.toFixed(2)}, ${finalSize.y.toFixed(2)}, ${finalSize.z.toFixed(2)}), Center:`, finalCenter);

          // Pass bloomPass (UnrealBloomPass is passes[1])
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
  }, [selectedCar]); // ✅ Deps include selectedCar

  // 🎨 Apply color from swatches (gates on carLoadedRef to avoid null obj)
  useCarColor({ 
    carRef: objectRef, 
    color: carColor,
    selectedCar,
    enabled: carLoadedRef.current // Optional: Pass enabled if your hook supports it; otherwise, hook handles null internally
  });

  // 🪶 Load spoiler (UPDATED: Closer camera props + new tuning options for focused spoiler view)
  useSpoiler({
    sceneRef,
    objectRef,
    loaderRef,
    selectedSpoiler,
    selectedCar,
    spoilerVisibleRef,
    cameraRef,
    controlsRef, // ✅ NEW: Pass controlsRef for OrbitControls targeting
    cameraDistance: 4, // ✅ FIXED: Reduced from 6 to 4 (closer to back/spoiler; tune: 3=very close, 5=moderate)
    focusHeight: 2.5, // ✅ UPDATED: From 1.8 to 2.5 (better elevation for framing; tune: 2=lower, 3=higher)
    smoothTransition: true, // ✅ Smooth camera repositioning (1s lerp; set false for instant)
    sideOffset: 1.5, // ✅ NEW: Slight x-offset for angled side view (0=pure rear, 2=more side)
    overviewHeight: 5, // ✅ NEW: Height for reset overview (elevated full-car view when no spoiler)
    enablePerCarTuning: true, // ✅ NEW: Enable dynamic adjustments per car (set false to use fixed values)
    minCameraDistance: 3, // ✅ NEW: Minimum Z-distance clamp (prevents clipping/too-close issues)
    manualScale: { x: 1.2, y: 1, z: 0.9 }, // ✅ Your custom: Widen spoiler, keep height, shorten depth
  });

  // 🛞 Tyre loader
  useTyreLoader({ sceneRef, objectRef, loaderRef, selectedTyre, selectedCar });

  return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />;
}