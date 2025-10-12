import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function useTyreLoader({
  sceneRef,
  objectRef,
  loaderRef,
  selectedTyre,
  selectedCar,
}) {
  // 🔹 Keep reference to the car's original tyres
  const stockTyresRef = useRef([]);

  useEffect(() => {
    if (!sceneRef.current || !objectRef.current) return;

    const loader = loaderRef.current;
    if (!loader) return;

    // --- Remove previous custom tyres ---
    const oldCustom = objectRef.current.getObjectByName("customTyres");
    if (oldCustom) {
      objectRef.current.remove(oldCustom);
      oldCustom.traverse((c) => {
        if (c.isMesh) {
          c.geometry?.dispose();
          if (Array.isArray(c.material)) {
            c.material.forEach((m) => m.dispose());
          } else {
            c.material?.dispose();
          }
        }
      });
    }

    // --- Collect stock tyres only once ---
    if (stockTyresRef.current.length === 0) {
      objectRef.current.traverse((child) => {
        if (child.isMesh) {
          const n = child.name.toLowerCase();
          if (n.includes("tyre") || n.includes("wheel") || n.includes("rim")) {
            stockTyresRef.current.push(child);
          }
        }
      });
    }

    // --- If "none" selected, restore stock tyres ---
    if (!selectedTyre || selectedTyre === "None") {
      stockTyresRef.current.forEach((tyre) => {
        if (tyre.parent && !tyre.parent.children.includes(tyre)) {
          tyre.parent.add(tyre);
        }
        tyre.visible = true; // ensure they are visible
      });
      console.log("🔄 Restored original stock tyres");
      return;
    }

    // --- Otherwise, hide stock tyres ---
    stockTyresRef.current.forEach((tyre) => {
      tyre.visible = false;
    });

    // --- Map tyre selection to GLB files ---
    const tyreFiles = {
      tyre1: "Tyre.glb",
      tyre2: "Tyres.glb",
      tyre3: "wheel.glb",
    };

    const tyreModel = tyreFiles[selectedTyre];
    if (!tyreModel) return;

    // --- Load new tyre set ---
    loader.load(
      `/models/Mehran/${selectedCar}/${tyreModel}`,
      (gltf) => {
        const tyreSet = gltf.scene;
        tyreSet.name = "customTyres";

        tyreSet.position.set(0, 0, 0);
        objectRef.current.add(tyreSet);

        console.log(`✅ Loaded ${selectedTyre} for ${selectedCar}`);
      },
      undefined,
      (err) => console.warn("❌ Tyre model not found:", err)
    );
  }, [selectedTyre, selectedCar]);
}
