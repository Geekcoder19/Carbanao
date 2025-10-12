import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";

export default function useSpoiler({
  sceneRef,
  objectRef,
  loaderRef,
  selectedSpoiler,
  selectedCar,
  spoilerVisibleRef,
  manualScale = { x: 1, y: 1, z: 1 },
  cameraRef,
  controlsRef,
  cameraDistance = 4,
  focusHeight = 3,
  smoothTransition = true,
  sideOffset = 1.5,
  overviewHeight = 5,
  enablePerCarTuning = true,
  minCameraDistance = 3,
}) {
  const animationRef = useRef(null);

  // Memoized static maps for performance
  const spoilerFileMap = useMemo(() => ({
    spoiler1: "spoiler.glb",
    spoiler2: "spoiler_1.glb",
  }), []);

  const perCarScale = useMemo(() => ({
    E: { x: 1, y: 1, z: 1 }, // Uniform scaling for E (tune if needed: e.g., {x:1.5,y:1.5,z:1.8} for slimmer)
    alto: { x: 1, y: 1, z: 1 },
    swift: { x: 9, y: 8, z: 10 },
    civic: {
      spoiler1: { x: 0.4, y: 0.4, z: 0.4 },
      spoiler2: { x: 0.3, y: 0.25, z: 0.48 },
      spoiler3: { x: 1, y: 1, z: 1 },
    },
    corolla: { x: 2.5, y: 2.5, z: 2.5 },
    city: { x: 1, y: 1, z: 1 },
  }), []);

  const spoilerOffsets = useMemo(() => ({
    E: { x: 0, y: 6, z: 100 }, // FIXED: Positive z for rear mounting (was -30, causing front placement); tune z=25-35 if needed
    alto: { x: 0, y: -1, z: 11 },
    swift: { x: 0, y: -9, z: 124 },
    civic: { x: 0, y: -0.5, z: 4 },
    corolla: {
      spoiler1: { x: 0, y: -4.5, z: 43 },
      spoiler2: { x: 0, y: -4.5, z: 43 },
      spoiler3: { x: 0, y: -4.5, z: 43 },
    },
    city: {
      default: { x: 0, y: -1, z: 11 },
      spoiler1: { x: 0, y: -1.8, z: 14 },
      spoiler2: { x: 0, y: -1.4, z: 14 },
      spoiler3: { x: 0, y: -1.0, z: 11.5 },
    },
  }), []);

  // Helper: Dispose object (reduces duplication)
  const disposeObject = (obj) => {
    obj.traverse((child) => {
      if (child.isMesh) {
        child.geometry?.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => mat.dispose());
        } else {
          child.material?.dispose();
        }
      }
    });
  };

  const cancelAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const repositionCamera = (targetPos, isSmooth = false) => {
    if (!cameraRef?.current) return;
    const camera = cameraRef.current;
    cancelAnimation();

    if (!isSmooth) {
      camera.position.copy(targetPos);
      controlsRef?.current?.update();
      return;
    }

    const startPos = camera.position.clone();
    const startTime = performance.now();
    const duration = 1000;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const alpha = Math.min(elapsed / duration, 1);

      camera.position.lerpVectors(startPos, targetPos, alpha);
      controlsRef?.current?.update();

      if (alpha < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  const getDynamicValues = (lowerCar) => {
    if (!enablePerCarTuning) return { focusHeight, cameraDistance };

    let dynFocusHeight = focusHeight;
    let dynCameraDistance = Math.max(cameraDistance, minCameraDistance);

    switch (lowerCar) {
      case "swift":
        dynFocusHeight += 1.5;
        dynCameraDistance += 2;
        break;
      case "civic":
      case "corolla":
        dynFocusHeight += 0.8;
        dynCameraDistance += 0.5;
        break;
      case "alto":
      case "city":
        dynFocusHeight += -0.2;
        break;
      case "e": // Added for E car (no special tuning; inherits defaults)
        break;
      default:
        break;
    }

    dynCameraDistance = Math.max(dynCameraDistance, minCameraDistance);
    dynCameraDistance = Math.min(dynCameraDistance, 8);

    return { focusHeight: dynFocusHeight, cameraDistance: dynCameraDistance };
  };

  useEffect(() => {
    return () => cancelAnimation();
  }, []);

  useEffect(() => {
    if (!sceneRef.current || !objectRef.current) return;

    const lowerCar = selectedCar.toLowerCase();
    const { focusHeight: dynFocusHeight, cameraDistance: dynDistance } =
      getDynamicValues(lowerCar);

    // ─── Remove spoiler when deselected ──────────────────────────────
    if (!selectedSpoiler) {
      const oldSpoiler = objectRef.current.getObjectByName("customSpoiler");
      if (oldSpoiler) {
        objectRef.current.remove(oldSpoiler);
        disposeObject(oldSpoiler);
        spoilerVisibleRef.current = false;

        if (cameraRef?.current) {
          const carBox = new THREE.Box3().setFromObject(objectRef.current);
          const carCenter = new THREE.Vector3();
          carBox.getCenter(carCenter);
          objectRef.current.localToWorld(carCenter);

          const overviewPos = new THREE.Vector3(
            carCenter.x - 8,
            carCenter.y + overviewHeight,
            carCenter.z - 6
          );

          repositionCamera(overviewPos, smoothTransition);
          cameraRef.current.lookAt(carCenter);
          if (controlsRef?.current) {
            controlsRef.current.target.copy(carCenter);
            controlsRef.current.update();
          }
        }
        return;
      }
      return;
    }

    const loader = loaderRef.current;
    if (!loader) return;

    // ─── Remove old spoiler safely ──────────────────────────────────
    const oldSpoiler = objectRef.current.getObjectByName("customSpoiler");
    if (oldSpoiler) {
      objectRef.current.remove(oldSpoiler);
      disposeObject(oldSpoiler);
      spoilerVisibleRef.current = false;
    }

    const spoilerFile = spoilerFileMap[selectedSpoiler];
    if (!spoilerFile) return;

    const spoilerPath = `/models/Mehran/${lowerCar}/${spoilerFile}`;
    console.log(`🔍 Loading spoiler for ${selectedCar}: ${spoilerPath}`);

    loader.load(
      spoilerPath,
      (gltf) => {
        const spoilerObj = gltf.scene || gltf.scenes?.[0];
        if (!spoilerObj) {
          console.error("⚠️ Empty spoiler GLB:", spoilerFile);
          return;
        }
        spoilerObj.name = "customSpoiler";

        objectRef.current.updateWorldMatrix(true, true);
        spoilerObj.updateWorldMatrix(true, true);

        const carBox = new THREE.Box3().setFromObject(objectRef.current);
        const carSize = new THREE.Vector3();
        carBox.getSize(carSize);
        if (carSize.x <= 0) {
          console.warn("⚠️ Invalid car size, skipping spoiler");
          return;
        }

        const initialSpoilerBox = new THREE.Box3().setFromObject(spoilerObj);
        const initialSpoilerSize = new THREE.Vector3();
        initialSpoilerBox.getSize(initialSpoilerSize);
        if (initialSpoilerSize.x <= 0) {
          console.warn("⚠️ Invalid spoiler size, skipping scale");
          objectRef.current.add(spoilerObj);
          spoilerVisibleRef.current = true;
          return;
        }

        const targetWidth = carSize.x * 0.9;
        const scaleFactor = targetWidth / initialSpoilerSize.x;
        if (!(isFinite(scaleFactor) && scaleFactor > 0)) {
          console.warn("⚠️ Invalid scale factor for spoiler");
          return;
        }

        spoilerObj.scale.setScalar(scaleFactor);

        spoilerObj.scale.x *= manualScale.x;
        spoilerObj.scale.y *= manualScale.y;
        spoilerObj.scale.z *= manualScale.z;

        // ✅ Apply per-car scaling (E uses uniform 2x)
        let carScale = perCarScale[lowerCar] || { x: 1, y: 1, z: 1 };
        if (lowerCar === "civic" && perCarScale.civic?.[selectedSpoiler]) {
          carScale = perCarScale.civic[selectedSpoiler];
        }

        spoilerObj.scale.x *= carScale.x;
        spoilerObj.scale.y *= carScale.y;
        spoilerObj.scale.z *= carScale.z;

        spoilerObj.updateWorldMatrix(true, true);

        const newSpoilerBox = new THREE.Box3().setFromObject(spoilerObj);
        const newSpoilerSize = new THREE.Vector3();
        newSpoilerBox.getSize(newSpoilerSize);
        let useBox = newSpoilerBox;
        if (
          newSpoilerSize.x < 0.01 ||
          newSpoilerSize.y < 0.01 ||
          newSpoilerSize.z < 0.01 ||
          !isFinite(newSpoilerBox.min.y)
        ) {
          console.warn("⚠️ Invalid scaled spoiler size, using initial");
          useBox = initialSpoilerBox;
        }

        const rearTopWorld = new THREE.Vector3(
          (carBox.max.x + carBox.min.x) / 2,
          carBox.max.y,
          carBox.max.z
        );
        objectRef.current.worldToLocal(rearTopWorld);

        // ✅ Apply offsets (E: rear-mounted with positive z)
        let offsets = spoilerOffsets[lowerCar] || { x: 0, y: 0, z: 0 };
        if (
          (lowerCar === "corolla" || lowerCar === "city") &&
          spoilerOffsets[lowerCar]?.[selectedSpoiler]
        ) {
          offsets = spoilerOffsets[lowerCar][selectedSpoiler];
        } else if (lowerCar === "city" && spoilerOffsets[lowerCar]?.default) {
          offsets = spoilerOffsets[lowerCar].default;
        }

        if (lowerCar === "e" && offsets.z < 0) {
          console.warn("⚠️ Negative z offset for E detected – auto-correcting to positive for rear mounting");
          offsets.z = Math.abs(offsets.z); // Safety: Ensure positive for rear
        }

        const localMinY = useBox.min.y;
        const positionY = rearTopWorld.y - localMinY + offsets.y;
        const localCenterX = (useBox.min.x + useBox.max.x) / 2;
        const positionX = rearTopWorld.x - localCenterX + offsets.x;
        const localMinZ = useBox.min.z;
        const positionZ = rearTopWorld.z - localMinZ + offsets.z;

        spoilerObj.position.set(positionX, positionY, positionZ);
        objectRef.current.add(spoilerObj);
        spoilerVisibleRef.current = true;

        // Specific log for E
        if (lowerCar === "e") {
          console.log(`✅ E spoiler positioned at rear: pos=(${positionX.toFixed(2)}, ${positionY.toFixed(2)}, ${positionZ.toFixed(2)}), scale=(${spoilerObj.scale.x.toFixed(2)}, ${spoilerObj.scale.y.toFixed(2)}, ${spoilerObj.scale.z.toFixed(2)})`);
        } else {
          console.log(`✅ Spoiler for ${selectedCar} loaded and positioned.`);
        }
      },
      undefined,
      (error) => console.error("❌ Error loading spoiler:", error)
    );
  }, [selectedSpoiler, selectedCar, manualScale]);

  return {};
}