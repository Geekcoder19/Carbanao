import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

// Define empty stubs for the functions expected by the parent component (main.jsx)
const updateLightsForCar = () => {};
const normalizeCarMaterials = () => {};

export function setupScene(containerRef, sceneRef, cameraRef, rendererRef, controlsRef, loaderRef) {
  if (!containerRef.current) return {};

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);
  sceneRef.current = scene;

  // Camera
  const camera = new THREE.PerspectiveCamera(
    60,
    containerRef.current.clientWidth / containerRef.current.clientHeight,
    0.1,
    1000
  );
  camera.position.set(10, 5, 15);
  cameraRef.current = camera;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding; 
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  
  // 1. FIX: Reduce overall exposure. HDRIs tend to be very bright.
  renderer.toneMappingExposure = 0.5; // Changed from 1.0 to 0.5 (or even lower like 0.3)

  containerRef.current.appendChild(renderer.domElement);
  rendererRef.current = renderer;

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controlsRef.current = controls;

  // Lights
  // 2. FIX: Reduce intensities of direct lights to prevent clipping/over-exposure.
  // AmbientLight was correctly removed in the previous fix.

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.3); // Reduced intensity from 1 to 0.3
  dirLight.position.set(10, 20, 10);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(2048, 2048);
  scene.add(dirLight);

  const spotLight = new THREE.SpotLight(0xffffff, 0.5); // Reduced intensity from 1.5 to 0.5
  spotLight.position.set(15, 25, 15);
  spotLight.castShadow = true;
  spotLight.angle = Math.PI / 6;
  scene.add(spotLight);

  // GLTF Loader
  const gltfLoader = new GLTFLoader();
  loaderRef.current = gltfLoader;

  // HDRI reflections
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader(); 

  new RGBELoader().setDataType(THREE.HalfFloatType).load("/hdr/studio.hdr", (hdrEquirect) => {
    const envMap = pmremGenerator.fromEquirectangular(hdrEquirect).texture;
    scene.environment = envMap;
    scene.background = envMap;
    hdrEquirect.dispose();
    pmremGenerator.dispose();
    
    // We can also adjust exposure here if needed, but 0.5 earlier should be effective
  });

  // Load showroom (material processing kept local)
  loaderRef.current.load("/models/Mehran/showroom.glb", (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;
        const name = child.name.toLowerCase();

        // Tyres: matte black
        if (name.includes("tyre")) {
          if (child.material.isMeshStandardMaterial) {
            child.material.roughness = 0.9;
            child.material.metalness = 0.1;
          }
          return;
        }

        // Rims: keep textures or shiny silver
        if (name.includes("rim") || name.includes("wheel")) {
          if (child.material.isMeshStandardMaterial) {
            if (child.material.map || child.material.metalnessMap || child.material.roughnessMap) {
              child.material.envMapIntensity = 1.2;
            } else {
              child.material.metalness = 1.0;
              child.material.roughness = 0.2;
              child.material.color = new THREE.Color(0xcccccc);
              child.material.envMapIntensity = 1.5;
            }
          }
          return;
        }

        // Other meshes
        if (child.material.isMeshStandardMaterial) {
          child.material.roughness = 0.4;
          child.material.metalness = 0.3;
        }
      }
    });
    scene.add(model);
  });

  // Post-processing
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  // 3. FIX: Adjust Bloom Pass parameters for less intensity.
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(containerRef.current.clientWidth, containerRef.current.clientHeight),
    0.3, // Strength reduced from 0.6 to 0.3
    0.4,
    0.85
  );
  composer.addPass(bloomPass);

  // Animate
  let animationFrameId;
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    controls.update();
    composer.render();
  };
  animate();

  // Resize
  const onResize = () => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    composer.setSize(width, height);
  };
  window.addEventListener("resize", onResize);

  // ✅ Return cleanup references and stubs for external functions
  return { 
        scene, 
        camera, 
        renderer, 
        controls, 
        composer, 
        updateLightsForCar, // Stubbed function 
        normalizeCarMaterials, // Stubbed function 
        cleanup: () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", onResize);
        }
    };
}