"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

import {
  entrancePosition,
  entranceTarget,
} from "@/components/tour/tour-locations";
import type {
  NormalizedTourPoint,
  TourDestination,
  TourMode,
  VerticalDirection,
  WalkDirection,
} from "@/components/tour/tour-types";

type ModelMetrics = {
  bounds: THREE.Box3;
  maxDimension: number;
  size: THREE.Vector3;
  walkHeight: number;
  walkStart: THREE.Vector3;
  walkTarget: THREE.Vector3;
};

type ActiveRoute = {
  id: TourDestination["id"];
  label: string;
};

type NavigationState = {
  destination: TourDestination;
  pointIndex: number;
  points: THREE.Vector3[];
};

type TourEngine = {
  cancelNavigation: () => void;
  navigateTo: (destination: TourDestination) => void;
  reset: (mode: TourMode) => void;
  setMobileMovement: (right: number, forward: number) => void;
  setMode: (mode: TourMode) => void;
  setRunEnabled: (enabled: boolean) => void;
  setVerticalDirection: (
    direction: VerticalDirection,
    active: boolean,
  ) => void;
};

const MODEL_URL =
  "/models/condominio-mv2/condominio-mv2-completo-c866bf2b.glb";
const WALK_EYE_HEIGHT = 1.72;
const BASE_WALK_SPEED_METERS_PER_SECOND = 2.4;
const WALK_SPEED_MULTIPLIER = 5;
const RUN_SPEED_MULTIPLIER = 10;
const AUTOMATIC_ROUTE_SPEED_MULTIPLIER = 2.5;

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

function normalizedPointToWorld(
  point: NormalizedTourPoint,
  bounds: THREE.Box3,
  size: THREE.Vector3,
  y: number,
) {
  return new THREE.Vector3(
    bounds.min.x + size.x * point[0],
    y,
    bounds.min.z + size.z * point[1],
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

export function useCondominiumTour() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<TourEngine | null>(null);
  const modeRef = useRef<TourMode>("walk");
  const [activeRoute, setActiveRoute] = useState<ActiveRoute | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [mode, setMode] = useState<TourMode>("walk");

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    const mobileDevice = window.matchMedia(
      "(max-width: 767px), (pointer: coarse)",
    ).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
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
    let keyboardRunning = false;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let metrics: ModelMetrics | null = null;
    let modelRoot: THREE.Object3D | null = null;
    let raycastBounds: THREE.Box3 | null = null;
    let navigation: NavigationState | null = null;
    let runEnabled = false;
    let touchForwardAmount = 0;
    let touchRightAmount = 0;
    let walkHeightOffset = 0;
    let walkPitch = 0;
    let walkYaw = 0;

    const keyboardDirections = new Set<WalkDirection>();
    const keyboardVerticalDirections = new Set<VerticalDirection>();
    const touchVerticalDirections: Record<VerticalDirection, boolean> = {
      down: false,
      up: false,
    };

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaedff2);

    const camera = new THREE.PerspectiveCamera(54, 1, 0.08, 2000);
    camera.position.set(80, 60, 90);
    camera.rotation.order = "YXZ";

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;
    renderer.shadowMap.enabled = !mobileDevice;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.domElement.className = "block h-full w-full touch-none";
    renderer.domElement.tabIndex = 0;
    renderer.domElement.setAttribute(
      "aria-label",
      "Modelo tridimensional navegavel do Condominio Maranduba Ville II",
    );
    mount.appendChild(renderer.domElement);

    const roomEnvironment = new RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const environmentTexture = pmremGenerator.fromScene(
      roomEnvironment,
      0.04,
    ).texture;
    scene.environment = environmentTexture;
    roomEnvironment.dispose();
    pmremGenerator.dispose();

    const hemisphereLight = new THREE.HemisphereLight(
      0xf8fdff,
      0x65735a,
      1.85,
    );
    scene.add(hemisphereLight);

    const sunLight = new THREE.DirectionalLight(0xfff1d6, 3.1);
    sunLight.position.set(105, 165, 82);
    sunLight.castShadow = !mobileDevice;
    sunLight.shadow.mapSize.set(2048, 2048);
    sunLight.shadow.camera.left = -165;
    sunLight.shadow.camera.right = 165;
    sunLight.shadow.camera.top = 165;
    sunLight.shadow.camera.bottom = -165;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 420;
    sunLight.shadow.bias = -0.00018;
    sunLight.shadow.normalBias = 0.035;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xc9e8ff, 0.9);
    fillLight.position.set(-80, 55, -75);
    scene.add(fillLight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.28));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = true;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.screenSpacePanning = true;

    const overviewTarget = new THREE.Vector3();
    const groundRaycaster = new THREE.Raycaster();
    const groundRayOrigin = new THREE.Vector3();
    const groundRayDirection = new THREE.Vector3(0, -1, 0);

    const resolveSurfaceHeight = (
      x: number,
      z: number,
      fallback: number,
    ) => {
      if (!raycastBounds || !modelRoot) {
        return fallback;
      }

      groundRayOrigin.set(x, raycastBounds.max.y + 10, z);
      groundRaycaster.set(groundRayOrigin, groundRayDirection);
      const surfaces = groundRaycaster
        .intersectObject(modelRoot, true)
        .map((intersection) => intersection.point.y);

      return surfaces.length > 0
        ? Math.min(...surfaces)
        : fallback;
    };

    const cancelNavigation = () => {
      navigation = null;
      setActiveRoute(null);
    };

    const clearMovement = () => {
      keyboardDirections.clear();
      keyboardVerticalDirections.clear();
      keyboardRunning = false;
      touchForwardAmount = 0;
      touchRightAmount = 0;
      touchVerticalDirections.down = false;
      touchVerticalDirections.up = false;
    };

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
      camera.near = Math.max(0.08, metrics.maxDimension / 3000);
      camera.far = metrics.maxDimension * 9;
      camera.updateProjectionMatrix();

      controls.target.copy(overviewTarget);
      controls.minDistance = Math.max(2, metrics.size.y * 0.15);
      controls.maxDistance = metrics.maxDimension * 4.5;
      controls.update();
    };

    const setWalkRotationToward = (target: THREE.Vector3) => {
      const direction = target.clone().sub(camera.position).setY(0);

      if (direction.lengthSq() < 0.0001) {
        return;
      }

      direction.normalize();
      walkYaw = Math.atan2(-direction.x, -direction.z);
      walkPitch = 0;
      camera.rotation.set(walkPitch, walkYaw, 0);
    };

    const setWalkPose = () => {
      if (!metrics) {
        return;
      }

      walkHeightOffset = 0;
      metrics.walkHeight = metrics.walkStart.y;
      camera.position.copy(metrics.walkStart);
      setWalkRotationToward(metrics.walkTarget);
    };

    const requestPointerLock = () => {
      if (
        !finePointer ||
        modeRef.current !== "walk" ||
        document.pointerLockElement === renderer.domElement
      ) {
        return;
      }

      renderer.domElement.focus({ preventScroll: true });
      try {
        const pointerLockRequest =
          renderer.domElement.requestPointerLock();
        void pointerLockRequest?.catch(() => {});
      } catch {
        // Unsupported embedded browsers keep the touch and keyboard controls.
      }
    };

    const applyMode = (nextMode: TourMode, resetPose: boolean) => {
      modeRef.current = nextMode;
      clearMovement();
      cancelNavigation();

      if (!metrics) {
        return;
      }

      controls.enabled = nextMode === "overview";

      if (nextMode === "overview") {
        if (document.pointerLockElement === renderer.domElement) {
          document.exitPointerLock();
        }
        fitOverview();
      } else if (resetPose) {
        setWalkPose();
      }
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

    engineRef.current = {
      cancelNavigation,
      navigateTo: (destination) => {
        if (!metrics) {
          return;
        }

        modeRef.current = "walk";
        setMode("walk");
        controls.enabled = false;
        const points = destination.waypoints.map((point) => {
          const worldPoint = normalizedPointToWorld(
            point,
            metrics!.bounds,
            metrics!.size,
            metrics!.bounds.min.y,
          );
          worldPoint.y =
            resolveSurfaceHeight(
              worldPoint.x,
              worldPoint.z,
              metrics!.walkHeight - WALK_EYE_HEIGHT,
            ) + WALK_EYE_HEIGHT;
          return worldPoint;
        });
        navigation = {
          destination,
          pointIndex: 0,
          points,
        };
        setActiveRoute({
          id: destination.id,
          label: destination.label,
        });
        requestPointerLock();
      },
      reset: (nextMode) => {
        applyMode(nextMode, true);
        if (nextMode === "walk") {
          requestPointerLock();
        }
      },
      setMobileMovement: (right, forward) => {
        touchRightAmount = THREE.MathUtils.clamp(right, -1, 1);
        touchForwardAmount = THREE.MathUtils.clamp(forward, -1, 1);

        if (Math.abs(right) > 0.02 || Math.abs(forward) > 0.02) {
          cancelNavigation();
        }
      },
      setMode: (nextMode) => {
        const changed = modeRef.current !== nextMode;
        applyMode(nextMode, changed);

        if (nextMode === "walk") {
          requestPointerLock();
        }
      },
      setRunEnabled: (enabled) => {
        runEnabled = enabled;
      },
      setVerticalDirection: (direction, active) => {
        touchVerticalDirections[direction] = active;

        if (active && metrics) {
          cancelNavigation();
          updateWalkHeight(direction, 0.45);
        }
      },
    };

    const resizeRenderer = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      const pixelRatio = mobileDevice
        ? Math.min(window.devicePixelRatio, 0.82)
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

      if (modeRef.current !== "walk") {
        return;
      }

      if (
        event.code === "ControlLeft" ||
        event.code === "ControlRight"
      ) {
        event.preventDefault();
        keyboardRunning = true;
        cancelNavigation();
      } else if (event.code === "Space") {
        event.preventDefault();
        keyboardVerticalDirections.add("up");
        cancelNavigation();
      } else if (
        event.code === "ShiftLeft" ||
        event.code === "ShiftRight"
      ) {
        event.preventDefault();
        keyboardVerticalDirections.add("down");
        cancelNavigation();
      } else if (direction) {
        event.preventDefault();
        keyboardDirections.add(direction);
        cancelNavigation();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const direction = keyDirections[event.code];

      if (
        event.code === "ControlLeft" ||
        event.code === "ControlRight"
      ) {
        keyboardRunning = false;
      } else if (event.code === "Space") {
        keyboardVerticalDirections.delete("up");
      } else if (
        event.code === "ShiftLeft" ||
        event.code === "ShiftRight"
      ) {
        keyboardVerticalDirections.delete("down");
      } else if (direction) {
        keyboardDirections.delete(direction);
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      if (
        modeRef.current !== "walk" ||
        document.pointerLockElement !== renderer.domElement
      ) {
        return;
      }

      walkYaw -= event.movementX * 0.0022;
      walkPitch = THREE.MathUtils.clamp(
        walkPitch - event.movementY * 0.0019,
        -1.25,
        1.25,
      );
      camera.rotation.set(walkPitch, walkYaw, 0);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (modeRef.current !== "walk" || finePointer) {
        return;
      }

      event.preventDefault();
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
        -1.15,
        1.15,
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

    const onPointerLockChange = () => {
      const locked =
        document.pointerLockElement === renderer.domElement;
      setIsPointerLocked(locked);

      if (!locked) {
        clearMovement();
      }
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
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("pointerlockchange", onPointerLockChange);
    renderer.domElement.addEventListener("click", requestPointerLock);
    renderer.domElement.addEventListener("pointercancel", releasePointer);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", releasePointer);
    renderer.domElement.addEventListener(
      "webglcontextlost",
      onContextLost,
      false,
    );

    const ktx2Loader = new KTX2Loader()
      .setTranscoderPath("/basis/")
      .detectSupport(renderer);
    const loader = new GLTFLoader();
    loader.setKTX2Loader(ktx2Loader);
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      MODEL_URL,
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
        raycastBounds = bounds;
        modelRoot = gltf.scene;
        const preliminaryWalkStart = normalizedPointToWorld(
          entrancePosition,
          bounds,
          size,
          bounds.min.y,
        );
        const walkHeight =
          resolveSurfaceHeight(
            preliminaryWalkStart.x,
            preliminaryWalkStart.z,
            bounds.min.y,
          ) + WALK_EYE_HEIGHT;
        const maximumAnisotropy =
          renderer.capabilities.getMaxAnisotropy();

        gltf.scene.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) {
            return;
          }

          object.castShadow = !mobileDevice;
          object.receiveShadow = true;

          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach((material) => {
            if (material instanceof THREE.MeshStandardMaterial) {
              material.envMapIntensity = 0.72;
              material.roughness = THREE.MathUtils.clamp(
                material.roughness * 0.9,
                0.28,
                1,
              );
            }

            Object.values(material).forEach((value) => {
              if (value instanceof THREE.Texture) {
                value.anisotropy = Math.min(
                  maximumAnisotropy,
                  mobileDevice ? 2 : 8,
                );
                value.needsUpdate = true;
              }
            });
          });
        });

        metrics = {
          bounds,
          maxDimension,
          size,
          walkHeight,
          walkStart: preliminaryWalkStart.setY(walkHeight),
          walkTarget: normalizedPointToWorld(
            entranceTarget,
            bounds,
            size,
            walkHeight,
          ),
        };
        scene.add(modelRoot);
        renderer.shadowMap.needsUpdate = !mobileDevice;

        applyMode(modeRef.current, true);
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
      keyboardDirections.has(direction);
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
        if (navigation) {
          const target = navigation.points[navigation.pointIndex];
          const routeDirection = target
            .clone()
            .sub(camera.position)
            .setY(0);
          const distance = routeDirection.length();

          if (distance < 0.7) {
            metrics.walkHeight = target.y;
            walkHeightOffset = 0;
            navigation.pointIndex += 1;

            if (navigation.pointIndex >= navigation.points.length) {
              cancelNavigation();
            }
          } else {
            routeDirection.normalize();
            metrics.walkHeight = THREE.MathUtils.damp(
              metrics.walkHeight,
              target.y,
              7,
              delta,
            );
            walkHeightOffset = 0;
            camera.position.addScaledVector(
              routeDirection,
              Math.min(
                distance,
                BASE_WALK_SPEED_METERS_PER_SECOND *
                  AUTOMATIC_ROUTE_SPEED_MULTIPLIER *
                  delta,
              ),
            );
            setWalkRotationToward(target);
          }
        } else {
          const forwardAmount = THREE.MathUtils.clamp(
            Number(isMoving("forward")) -
              Number(isMoving("backward")) +
              touchForwardAmount,
            -1,
            1,
          );
          const rightAmount = THREE.MathUtils.clamp(
            Number(isMoving("right")) -
              Number(isMoving("left")) +
              touchRightAmount,
            -1,
            1,
          );
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
              .addScaledVector(right, rightAmount);

            if (movement.lengthSq() > 1) {
              movement.normalize();
            }

            camera.position.addScaledVector(
              movement,
              BASE_WALK_SPEED_METERS_PER_SECOND *
                (runEnabled || keyboardRunning
                  ? RUN_SPEED_MULTIPLIER
                  : WALK_SPEED_MULTIPLIER) *
                delta,
            );
          }

          if (verticalAmount !== 0) {
            updateWalkHeight(
              verticalAmount > 0 ? "up" : "down",
              4.2 * delta,
            );
          }
        }

        camera.position.x = THREE.MathUtils.clamp(
          camera.position.x,
          metrics.bounds.min.x + 0.5,
          metrics.bounds.max.x - 0.5,
        );
        camera.position.z = THREE.MathUtils.clamp(
          camera.position.z,
          metrics.bounds.min.z + 0.5,
          metrics.bounds.max.z - 0.5,
        );
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
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener(
        "pointerlockchange",
        onPointerLockChange,
      );
      renderer.domElement.removeEventListener(
        "click",
        requestPointerLock,
      );
      renderer.domElement.removeEventListener(
        "pointercancel",
        releasePointer,
      );
      renderer.domElement.removeEventListener(
        "pointerdown",
        onPointerDown,
      );
      renderer.domElement.removeEventListener(
        "pointermove",
        onPointerMove,
      );
      renderer.domElement.removeEventListener(
        "pointerup",
        releasePointer,
      );
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        onContextLost,
      );

      if (document.pointerLockElement === renderer.domElement) {
        document.exitPointerLock();
      }

      controls.dispose();
      ktx2Loader.dispose();
      environmentTexture.dispose();

      if (modelRoot) {
        scene.remove(modelRoot);
        disposeModel(modelRoot);
      }

      raycastBounds = null;
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  const selectMode = (nextMode: TourMode) => {
    setMode(nextMode);

    if (engineRef.current) {
      engineRef.current.setMode(nextMode);
    } else {
      modeRef.current = nextMode;
    }
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

  const navigateTo = (destination: TourDestination) => {
    engineRef.current?.navigateTo(destination);
  };

  const updateVerticalDirection = (
    direction: VerticalDirection,
    active: boolean,
  ) => {
    engineRef.current?.setVerticalDirection(direction, active);
  };

  const updateMobileMovement = (right: number, forward: number) => {
    engineRef.current?.setMobileMovement(right, forward);
  };

  return {
    activeRoute,
    error,
    isLoaded,
    isPointerLocked,
    isRunning,
    loadProgress,
    mode,
    mountRef,
    navigateTo,
    resetView,
    selectMode,
    toggleRunning,
    updateMobileMovement,
    updateVerticalDirection,
  };
}
