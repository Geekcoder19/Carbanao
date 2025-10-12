// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// export function loadCar(loader, scene, camera, controls, objectRef, selectedCar, onLoadComplete) {
//   if (!selectedCar || !loader || !scene) return;

//   // 🔥 DEBUG: Log raw selectedCar for casing issues
//   console.log(`🔍 Raw selectedCar: "${selectedCar}"`);

//   const lowerCar = selectedCar.toLowerCase().replace('e', ''); // Flexible: "Jimney" → "jimny", "Swift" → "swift" (unchanged)
//   console.log(`🔍 Normalized lowerCar: "${lowerCar}"`);

//   // --- Remove previous car completely ---
//   if (objectRef.current) {
//     scene.remove(objectRef.current);

//     objectRef.current.traverse((c) => {
//       if (c.isMesh) {
//         c.geometry?.dispose();
//         // Don't dispose materials here—reuse for recoloring
//       }
//     });

//     while (objectRef.current.children.length) {
//       objectRef.current.remove(objectRef.current.children[0]);
//     }

//     objectRef.current = null;
//   }

//   // --- Load and align new car (normalize path to lowercase) ---
//   const modelPath = `/models/Mehran/${lowerCar}/${lowerCar}.glb`; // Assumes lowercase folder/file
//   console.log(`🔍 Loading from path: ${modelPath}`);
  
//   loader.load(
//     modelPath,
//     (gltf) => {
//       const obj = gltf.scene || gltf.scenes?.[0];
//       if (!obj) {
//         console.error("⚠️ Car model empty:", selectedCar, "Path:", modelPath);
//         return;
//       }

//       obj.name = "carRoot"; // Tag for color hook

//       // Compute initial bounding box
//       const box = new THREE.Box3().setFromObject(obj);
//       const size = new THREE.Vector3();
//       box.getSize(size);
//       const center = new THREE.Vector3();
//       box.getCenter(center);

//       // 🔥 DEBUG: Log initial box for Swift/Jimney quirks
//       console.log(`🔍 Initial Box for ${selectedCar}: min.y=${box.min.y.toFixed(2)}, size=${size.x.toFixed(2)}x${size.y.toFixed(2)}x${size.z.toFixed(2)}`);

//       // Normalize position (center x/z, ground y)
//       obj.position.x -= center.x;
//       obj.position.z -= center.z;
//       obj.position.y -= box.min.y;

//       // Rotate to face +Z
//       obj.rotation.set(0, Math.PI, 0);

//       // Scale uniformly to target width
//       const targetWidth = 4;
//       const scaleFactor = targetWidth / size.x;
//       obj.scale.setScalar(scaleFactor);

//       // Recompute bounding box after scaling/rotation
//       obj.updateMatrixWorld(true);
//       const newBox = new THREE.Box3().setFromObject(obj);
//       const newSize = new THREE.Vector3();
//       newBox.getSize(newSize);
//       const newCenter = new THREE.Vector3();
//       newBox.getCenter(newCenter);

//       // 🔥 ROOT-ONLY GROUNDING: Adjust entire model via root position.y
//       let finalY = -newBox.min.y; // Base: Ground lowest point to y=0

//       // Per-car Y tweaks (add to base; tune as needed)
//       const carYOffset = {
//         alto: 2.1,    // Extra lift for Alto
//         corolla: -0.3, // Slight drop for Corolla
//         city: 1.6,    // Custom lift for City
//         civic: -0.3,  // Slight drop for Civic
//         swift: -0.3,  // Mild drop for Swift (increase to -0.8 if still floating)
//       };
//       const yTweak = carYOffset[lowerCar] || 0; // Fallback to 0 if unknown
//       finalY += yTweak;
      
//       // 🔥 Swift-specific log for debugging floating
//       if (lowerCar.includes('swift')) {
//         console.log(`🔍 Swift y-tweak applied: ${yTweak} (mild drop to fix floating)`);
//       }
      
//       console.log(`🔍 Y Calc for ${selectedCar}: base=${(-newBox.min.y).toFixed(2)}, tweak=${yTweak}, finalY=${finalY.toFixed(2)}`);

//       obj.position.y = finalY; // Apply to root—moves whole car!

//       // 🔥 Per-car Z tweaks (forward/backward adjustment)
//       const carZOffset = {
//         swift: 0.9,   // 🔥 Move Swift forward (+Z, towards camera) by 1 unit (adjust: +0.5 subtle, +1.5 more)
//       };
//       const zTweak = carZOffset[lowerCar] || 0; // Fallback to 0 if unknown
      
//       // 🔥 Swift-specific log for forward positioning
//       if (lowerCar.includes('swift')) {
//         console.log(`🔍 Swift z-tweak applied: ${zTweak} (forward adjustment)`);
//       }
      
//       obj.position.z += zTweak; // Apply forward offset after centering/Y

//       // 🔥 Final recompute for camera/controls (after Z-tweak)
//       obj.updateMatrixWorld(true);
//       const finalBox = new THREE.Box3().setFromObject(obj);
//       const finalSize = new THREE.Vector3();
//       finalBox.getSize(finalSize);
//       const finalCenter = new THREE.Vector3();
//       finalBox.getCenter(finalCenter);

//       // Add to scene
//       scene.add(obj);
//       objectRef.current = obj;

//       // Adapt camera/controls to final position (auto-adjusts for Z-offset)
//       const maxDim = Math.max(finalSize.x, finalSize.y, finalSize.z);
//       const fov = camera.fov * (Math.PI / 180);
//       let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
//       camera.position.set(0, finalSize.y * 0.5, cameraZ * 0.8);
//       controls.target.copy(finalCenter);
//       controls.update();

//       console.log(`🔍 Z Calc for ${selectedCar}: tweak=${zTweak}, finalZ=${obj.position.z.toFixed(2)}`);
//       console.log(`✅ Loaded & positioned ${selectedCar} (${lowerCar}) at y=${finalY.toFixed(2)} (tweak: +${yTweak.toFixed(2)}), z=${obj.position.z.toFixed(2)} (tweak: +${zTweak.toFixed(2)}), center:`, finalCenter, `Final size: ${finalSize.x.toFixed(2)}x${finalSize.y.toFixed(2)}x${finalSize.z.toFixed(2)}`);

//       // 🔥 Trigger coloring after positioning (pass obj for traversal)
//       if (onLoadComplete) {
//         onLoadComplete(obj); // e.g., applyCarColor(obj, carColor)
//       }
//     },
//     (progress) => {
//       // 🔥 Optional: Log progress for slow loads
//       if (progress.total > 0) {
//         const percent = (progress.loaded / progress.total * 100).toFixed(0);
//         console.log(`📊 ${selectedCar} load progress: ${percent}%`);
//       }
//     },
//     (err) => {
//       console.error("❌ Error loading car:", selectedCar, "Path:", modelPath, err);
//     }
//   );
// }

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export function loadCar(loader, scene, camera, controls, objectRef, selectedCar, onLoadComplete) {
  if (!selectedCar || !loader || !scene) return;

  // 🔍 Log selected car for debugging
  console.log(`🔍 Raw selectedCar: "${selectedCar}"`);

  // ✅ Convert to Title Case (first letter uppercase, rest lowercase)
  const titleCar = selectedCar.charAt(0).toUpperCase() + selectedCar.slice(1).toLowerCase();
  console.log(`🔍 Normalized titleCar: "${titleCar}"`);

  // --- Remove previous car completely ---
  if (objectRef.current) {
    scene.remove(objectRef.current);

    objectRef.current.traverse((c) => {
      if (c.isMesh) {
        c.geometry?.dispose();
      }
    });

    while (objectRef.current.children.length) {
      objectRef.current.remove(objectRef.current.children[0]);
    }

    objectRef.current = null;
  }

  // ✅ Build proper path for Title Case structure
  const modelPath = `/models/Mehran/${titleCar}/${titleCar}.glb`;
  console.log(`🔍 Loading from path: ${modelPath}`);

  loader.load(
    modelPath,
    (gltf) => {
      const obj = gltf.scene || gltf.scenes?.[0];
      if (!obj) {
        console.error("⚠️ Car model empty:", selectedCar, "Path:", modelPath);
        return;
      }

      obj.name = "carRoot";

      // Compute initial bounding box
      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);

      console.log(`🔍 Initial Box for ${selectedCar}: min.y=${box.min.y.toFixed(2)}, size=${size.x.toFixed(2)}x${size.y.toFixed(2)}x${size.z.toFixed(2)}`);

      // Normalize position (center x/z, ground y)
      obj.position.x -= center.x;
      obj.position.z -= center.z;
      obj.position.y -= box.min.y;

      // Rotate to face +Z
      obj.rotation.set(0, Math.PI, 0);

      // Scale uniformly to target width
      const targetWidth = 4;
      const scaleFactor = targetWidth / size.x;
      obj.scale.setScalar(scaleFactor);

      // Recompute bounding box
      obj.updateMatrixWorld(true);
      const newBox = new THREE.Box3().setFromObject(obj);
      const newSize = new THREE.Vector3();
      newBox.getSize(newSize);

      // Grounding adjustments
      let finalY = -newBox.min.y;
      const carYOffset = {
        Alto: 2.1,
        Corolla: -0.3,
        City: 1.6,
        Civic: -0.3,
        Swift: -0.3,
        E:-0.3,
      };
      const yTweak = carYOffset[titleCar] || 0;
      finalY += yTweak;

      console.log(`🔍 Y Calc for ${selectedCar}: base=${(-newBox.min.y).toFixed(2)}, tweak=${yTweak}, finalY=${finalY.toFixed(2)}`);

      obj.position.y = finalY;

      // Z offsets (forward/backward)
      const carZOffset = {
        Swift: 0.9,
      };
      const zTweak = carZOffset[titleCar] || 0;
      obj.position.z += zTweak;

      obj.updateMatrixWorld(true);
      const finalBox = new THREE.Box3().setFromObject(obj);
      const finalSize = new THREE.Vector3();
      finalBox.getSize(finalSize);
      const finalCenter = new THREE.Vector3();
      finalBox.getCenter(finalCenter);

      // Add to scene
      scene.add(obj);
      objectRef.current = obj;

      // Adjust camera/controls
      const maxDim = Math.max(finalSize.x, finalSize.y, finalSize.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
      camera.position.set(0, finalSize.y * 0.5, cameraZ * 0.8);
      controls.target.copy(finalCenter);
      controls.update();

      console.log(`✅ Loaded & positioned ${selectedCar} (${titleCar}) at y=${finalY.toFixed(2)}, z=${obj.position.z.toFixed(2)}, center:`, finalCenter);

      if (onLoadComplete) onLoadComplete(obj);
    },
    (progress) => {
      if (progress.total > 0) {
        const percent = ((progress.loaded / progress.total) * 100).toFixed(0);
        console.log(`📊 ${selectedCar} load progress: ${percent}%`);
      }
    },
    (err) => {
      console.error("❌ Error loading car:", selectedCar, "Path:", modelPath, err);
    }
  );
}
