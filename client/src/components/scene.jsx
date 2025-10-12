import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

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
  containerRef.current.appendChild(renderer.domElement);
  rendererRef.current = renderer;

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controlsRef.current = controls;

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(10, 20, 10);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(2048, 2048);
  scene.add(dirLight);

  const spotLight = new THREE.SpotLight(0xffffff, 1.5);
  spotLight.position.set(15, 25, 15);
  spotLight.castShadow = true;
  spotLight.angle = Math.PI / 6;
  scene.add(spotLight);

  // ✅ Simple GLTF Loader (no DRACO)
  const gltfLoader = new GLTFLoader();
  loaderRef.current = gltfLoader;

  // HDRI reflections
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  new RGBELoader().load("/hdr/studio.hdr", (hdrEquirect) => {
    const envMap = pmremGenerator.fromEquirectangular(hdrEquirect).texture;
    scene.environment = envMap;
    scene.background = envMap;
    hdrEquirect.dispose();
    pmremGenerator.dispose();
  });

  // Load showroom
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
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(containerRef.current.clientWidth, containerRef.current.clientHeight),
    0.6,
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

  // Renderer tone mapping
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  // ✅ Return cleanup references
  return { scene, camera, renderer, controls, composer, cleanup: () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener("resize", onResize);
  }};
}
