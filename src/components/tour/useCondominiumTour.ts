"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

import type {
  TourMode,
  TourQuality,
  VerticalDirection,
  WalkDirection,
} from "@/components/tour/tour-types";

type ModelMetrics = {
  bounds: THREE.Box3;
  maxDimension: number;
  size: THREE.Vector3;
  walkStart: THREE.Vector3;
  walkHeight: number;
};

type TourEngine = {
  reset: (mode: TourMode) => void;
  setRunEnabled: (enabled: boolean) => void;
  setMode: (mode: TourMode) => void;
  setVerticalDirection: (
    direction: VerticalDirection,
    active: boolean,
  ) => void;
  setWalkDirection: (direction: WalkDirection, active: boolean) => void;
};

const DESKTOP_MODEL_URL =
  "/models/condominio-mv2/condominio-mv2-7c5adb14.glb";
const MOBILE_MODEL_URL =
  "/models/condominio-mv2/condominio-mv2-mobile.glb";

const keyDirections: Partial<Record<string, WalkDirection>> = {
  ArrowDown: "backward",
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "forward",
  KeyA: "left",
  KeyD: "right",
  KeyS: "backward",
  KeyW: "forward",
};

const keyVerticalDirections: Partial<
  Record<string, VerticalDirection>
> = {
  KeyE: "up",
  KeyQ: "down",
  PageDown: "down",
  PageUp: "up",
};

function shouldUseMobileModel() {
  const deviceMemory = (
    navigator as Navigator & { deviceMemory?: number }
  ).deviceMemory;

  return (
    window.matchMedia("(max-width: 767px), (pointer: coarse)").matches ||
    (deviceMemory !== undefined && deviceMemory <= 4) ||
    (navigator.hardwareConcurrency ?? 8) <= 4
  );
}

function disposeModel(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();

  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) {
      return;
    }

    geometries.add(object.geometry);
    const objectMaterials = Array.isArray(object.material)
      ? object.material
      : [object.material];

    objectMaterials.forEach((material) => {
      materials.add(material);
      Object.values(material).forEach((value) => {
        if (value instanceof THREE.Texture) {
          textures.add(value);
        }
      });
    });
  });

  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
}

function getWalkStart(bounds: THREE.Box3, size: THREE.Vector3) {
  const eyeHeight = THREE.MathUtils.clamp(size.y * 0.105, 1.65, 2.1);
  return new THREE.Vector3(
    0,
    bounds.min.y + Math.min(7.4, size.y * 0.45) + eyeHeight,
    size.z * 0.12,
  );
}

export function useCondominiumTour() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<TourEngine | null>(null);
  const modeRef = useRef<TourMode>("overview");
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [mode, setMode] = useState<TourMode>("overview");
  const [quality, setQuality] = useState<TourQuality>("mobile");

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    const mobileDevice = shouldUseMobileModel();
    const modelUrl = mobileDevice
      ? MOBILE_MODEL_URL
      : DESKTOP_MODEL_URL;
    setQuality(mobileDevice ? "mobile" : "full");

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias: false,
        powerPreference: "high-performance",
      });
    } catch {
      const errorTimer = window.setTimeout(() => {
        setError(
          "Este navegador nao conseguiu iniciar o passeio 3D. Atualize o navegador ou tente outro dispositivo.",
        );
      }, 0);
      return () => window.clearTimeout(errorTimer);
    }

    let animationFrame = 0;
    let cancelled = false;
    let draggedPointer: number | null = null;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let metrics: ModelMetrics | null = null;
    let modelRoot: THREE.Object3D | null = null;
    let keyboardRunning = false;
    let runEnabled = false;
    let walkHeightOffset = 0;
    let walkPitch = 0;
    let walkYaw = 0;

    const keyboardDirections = new Set<WalkDirection>();
    const keyboardVerticalDirections = new Set<VerticalDirection>();
    const touchDirections: Record<WalkDirection, boolean> = {
      backward: false,
      forward: false,
      left: false,
      right: false,
    };
    const touchVerticalDirections: Record<VerticalDirection, boolean> = {
      down: false,
      up: false,
    };

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdcecf1);

    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 2000);
    camera.position.set(80, 60, 90);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.domElement.className = "block h-full w-full touch-none";
    renderer.domElement.tabIndex = 0;
    renderer.domElement.setAttribute(
      "aria-label",
      "Modelo tridimensional navegavel do Condominio Maranduba Ville II",
    );
    mount.appendChild(renderer.domElement);

    const hemisphereLight = new THREE.HemisphereLight(
      0xf8fcff,
      0x63776b,
      2.2,
    );
    scene.add(hemisphereLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.4);
    directionalLight.position.set(80, 140, 60);
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xb9dcff, 0.9);
    fillLight.position.set(-90, 50, -70);
    scene.add(fillLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = true;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.screenSpacePanning = true;

    const overviewTarget = new THREE.Vector3();

    const fitOverview = () => {
      if (!metrics) {
        return;
      }

      const verticalFov = THREE.MathUtils.degToRad(camera.fov);
      const horizontalFov =
        2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
      const limitingFov = Math.max(
        THREE.MathUtils.degToRad(18),
        Math.min(verticalFov, horizontalFov),
      );
      const footprintRadius =
        Math.hypot(metrics.size.x, metrics.size.z) * 0.5;
      const distance =
        (footprintRadius / Math.sin(limitingFov / 2)) * 0.82;
      const direction = new THREE.Vector3(1, 0.58, 1.05).normalize();

      overviewTarget.set(0, metrics.size.y * 0.18, 0);
      camera.position
        .copy(overviewTarget)
        .addScaledVector(direction, distance);
      camera.near = Math.max(0.1, metrics.maxDimension / 3000);
      camera.far = metrics.maxDimension * 9;
      camera.updateProjectionMatrix();

      controls.target.copy(overviewTarget);
      controls.minDistance = Math.max(2, metrics.size.y * 0.15);
      controls.maxDistance = metrics.maxDimension * 4.5;
      controls.update();
    };

    const setWalkPose = () => {
      if (!metrics) {
        return;
      }

      const lookTarget = new THREE.Vector3(0, metrics.walkHeight, 0);

      walkHeightOffset = 0;
      camera.position.copy(metrics.walkStart);
      if (camera.position.distanceToSquared(lookTarget) < 25) {
        lookTarget.z -= Math.max(10, metrics.size.z * 0.15);
      }
      camera.lookAt(lookTarget);
      camera.rotation.order = "YXZ";

      const rotation = new THREE.Euler().setFromQuaternion(
        camera.quaternion,
        "YXZ",
      );
      walkPitch = rotation.x;
      walkYaw = rotation.y;
      camera.rotation.set(walkPitch, walkYaw, 0);
    };

    const clearMovement = () => {
      keyboardDirections.clear();
      keyboardVerticalDirections.clear();
      keyboardRunning = false;
      touchDirections.backward = false;
      touchDirections.forward = false;
      touchDirections.left = false;
      touchDirections.right = false;
      touchVerticalDirections.down = false;
      touchVerticalDirections.up = false;
    };

    const updateWalkHeight = (
      direction: VerticalDirection,
      amount: number,
    ) => {
      if (!metrics || modeRef.current !== "walk") {
        return;
      }

      const directionSign = direction === "up" ? 1 : -1;
      const maximumOffset = Math.max(
        4,
        Math.min(metrics.maxDimension * 0.32, 30),
      );
      walkHeightOffset = THREE.MathUtils.clamp(
        walkHeightOffset + directionSign * amount,
        0,
        maximumOffset,
      );
      camera.position.y = metrics.walkHeight + walkHeightOffset;
    };

    const applyMode = (nextMode: TourMode) => {
      modeRef.current = nextMode;
      clearMovement();

      if (!metrics) {
        return;
      }

      controls.enabled = nextMode === "overview";

      if (nextMode === "overview") {
        fitOverview();
      } else {
        setWalkPose();
      }
    };

    engineRef.current = {
      reset: applyMode,
      setRunEnabled: (enabled) => {
        runEnabled = enabled;
      },
      setMode: applyMode,
      setVerticalDirection: (direction, active) => {
        touchVerticalDirections[direction] = active;

        if (active && metrics) {
          updateWalkHeight(
            direction,
            Math.max(0.45, metrics.maxDimension * 0.003),
          );
        }
      },
      setWalkDirection: (direction, active) => {
        touchDirections[direction] = active;
      },
    };

    const resizeRenderer = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      const pixelRatio = mobileDevice
        ? Math.min(window.devicePixelRatio, 0.9)
        : Math.min(window.devicePixelRatio, 1.35);

      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resizeRenderer);
    resizeObserver.observe(mount);
    resizeRenderer();

    const onKeyDown = (event: KeyboardEvent) => {
      const direction = keyDirections[event.code];
      const verticalDirection = keyVerticalDirections[event.code];

      if (modeRef.current !== "walk") {
        return;
      }

      if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
        event.preventDefault();
        keyboardRunning = true;
      } else if (direction) {
        event.preventDefault();
        keyboardDirections.add(direction);
      } else if (verticalDirection) {
        event.preventDefault();
        keyboardVerticalDirections.add(verticalDirection);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const direction = keyDirections[event.code];
      const verticalDirection = keyVerticalDirections[event.code];

      if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
        keyboardRunning = false;
      } else if (direction) {
        keyboardDirections.delete(direction);
      } else if (verticalDirection) {
        keyboardVerticalDirections.delete(verticalDirection);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (modeRef.current !== "walk") {
        return;
      }

      event.preventDefault();
      renderer.domElement.focus({ preventScroll: true });
      draggedPointer = event.pointerId;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (
        modeRef.current !== "walk" ||
        draggedPointer !== event.pointerId
      ) {
        return;
      }

      const deltaX = event.clientX - lastPointerX;
      const deltaY = event.clientY - lastPointerY;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;

      walkYaw -= deltaX * 0.004;
      walkPitch = THREE.MathUtils.clamp(
        walkPitch - deltaY * 0.003,
        -1.1,
        1.1,
      );
      camera.rotation.set(walkPitch, walkYaw, 0);
    };

    const releasePointer = (event: PointerEvent) => {
      if (draggedPointer !== event.pointerId) {
        return;
      }

      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
      draggedPointer = null;
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      if (!cancelled) {
        setError(
          "O passeio 3D foi interrompido pelo navegador. Recarregue a pagina para continuar.",
        );
      }
    };

    window.addEventListener("blur", clearMovement);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    renderer.domElement.addEventListener("pointercancel", releasePointer);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", releasePointer);
    renderer.domElement.addEventListener(
      "webglcontextlost",
      onContextLost,
      false,
    );

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      modelUrl,
      (gltf) => {
        if (cancelled) {
          disposeModel(gltf.scene);
          return;
        }

        const originalBounds = new THREE.Box3().setFromObject(gltf.scene);

        if (originalBounds.isEmpty()) {
          setError("O modelo 3D nao possui geometria valida.");
          disposeModel(gltf.scene);
          return;
        }

        const originalCenter = originalBounds.getCenter(new THREE.Vector3());
        gltf.scene.position.set(
          -originalCenter.x,
          -originalBounds.min.y,
          -originalCenter.z,
        );
        gltf.scene.updateMatrixWorld(true);

        const bounds = new THREE.Box3().setFromObject(gltf.scene);
        const size = bounds.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);

        gltf.scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = false;
            object.receiveShadow = false;
          }
        });

        modelRoot = gltf.scene;
        const walkStart = getWalkStart(bounds, size);
        metrics = {
          bounds,
          maxDimension,
          size,
          walkStart,
          walkHeight: walkStart.y,
        };
        scene.add(modelRoot);
        applyMode(modeRef.current);
        setLoadProgress(100);
        setIsLoaded(true);
      },
      (event) => {
        if (cancelled) {
          return;
        }

        if (event.total > 0) {
          setLoadProgress(
            Math.min(99, Math.round((event.loaded / event.total) * 100)),
          );
        } else {
          setLoadProgress((current) => Math.min(92, current + 3));
        }
      },
      () => {
        if (!cancelled) {
          setError(
            "Nao foi possivel carregar o passeio 3D agora. Verifique a conexao e tente novamente.",
          );
        }
      },
    );

    const timer = new THREE.Timer();
    timer.connect(document);
    const movement = new THREE.Vector3();
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);

    const isMoving = (direction: WalkDirection) =>
      keyboardDirections.has(direction) || touchDirections[direction];
    const isMovingVertically = (direction: VerticalDirection) =>
      keyboardVerticalDirections.has(direction) ||
      touchVerticalDirections[direction];
    const minimumFrameInterval = mobileDevice ? 1000 / 30 : 0;
    let lastFrameTime = 0;

    const render = (timestamp: number) => {
      animationFrame = window.requestAnimationFrame(render);

      if (
        document.hidden ||
        (minimumFrameInterval > 0 &&
          timestamp - lastFrameTime < minimumFrameInterval)
      ) {
        return;
      }

      lastFrameTime = timestamp;
      timer.update(timestamp);
      const delta = Math.min(timer.getDelta(), 0.05);

      if (modeRef.current === "walk" && metrics) {
        const forwardAmount =
          Number(isMoving("forward")) - Number(isMoving("backward"));
        const rightAmount =
          Number(isMoving("right")) - Number(isMoving("left"));
        const verticalAmount =
          Number(isMovingVertically("up")) -
          Number(isMovingVertically("down"));

        if (forwardAmount !== 0 || rightAmount !== 0) {
          forward
            .set(0, 0, -1)
            .applyQuaternion(camera.quaternion)
            .setY(0)
            .normalize();
          right.crossVectors(forward, up).normalize();
          movement
            .copy(forward)
            .multiplyScalar(forwardAmount)
            .addScaledVector(right, rightAmount)
            .normalize();

          camera.position.addScaledVector(
            movement,
            metrics.maxDimension *
              0.035 *
              (runEnabled || keyboardRunning ? 2 : 1) *
              delta,
          );
          camera.position.x = THREE.MathUtils.clamp(
            camera.position.x,
            metrics.bounds.min.x + 1,
            metrics.bounds.max.x - 1,
          );
          camera.position.z = THREE.MathUtils.clamp(
            camera.position.z,
            metrics.bounds.min.z + 1,
            metrics.bounds.max.z - 1,
          );
        }

        if (verticalAmount !== 0) {
          updateWalkHeight(
            verticalAmount > 0 ? "up" : "down",
            metrics.maxDimension * 0.028 * delta,
          );
        }

        camera.position.y = metrics.walkHeight + walkHeightOffset;
      }

      if (controls.enabled) {
        controls.update();
      }

      renderer.render(scene, camera);
    };

    render(performance.now());

    return () => {
      cancelled = true;
      engineRef.current = null;
      window.cancelAnimationFrame(animationFrame);
      timer.dispose();
      resizeObserver.disconnect();
      window.removeEventListener("blur", clearMovement);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      renderer.domElement.removeEventListener(
        "pointercancel",
        releasePointer,
      );
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", releasePointer);
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        onContextLost,
      );
      controls.dispose();

      if (modelRoot) {
        scene.remove(modelRoot);
        disposeModel(modelRoot);
      }

      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  const selectMode = (nextMode: TourMode) => {
    modeRef.current = nextMode;
    setMode(nextMode);
    engineRef.current?.setMode(nextMode);
  };

  const resetView = () => {
    setIsRunning(false);
    engineRef.current?.setRunEnabled(false);
    engineRef.current?.reset(modeRef.current);
  };

  const toggleRunning = () => {
    setIsRunning((current) => {
      const next = !current;
      engineRef.current?.setRunEnabled(next);
      return next;
    });
  };

  const updateVerticalDirection = (
    direction: VerticalDirection,
    active: boolean,
  ) => {
    engineRef.current?.setVerticalDirection(direction, active);
  };

  const updateWalkDirection = (
    direction: WalkDirection,
    active: boolean,
  ) => {
    engineRef.current?.setWalkDirection(direction, active);
  };

  return {
    error,
    isLoaded,
    isRunning,
    loadProgress,
    mode,
    mountRef,
    quality,
    resetView,
    selectMode,
    toggleRunning,
    updateVerticalDirection,
    updateWalkDirection,
  };
}
