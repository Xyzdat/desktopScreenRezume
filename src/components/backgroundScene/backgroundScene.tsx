import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Box3, Group, Vector3 } from "three";
import styles from "./backgroundScene.module.scss";

const MODEL_PATH = "/models/ftm.glb";

function FullscreenModel() {
  const { scene } = useGLTF(MODEL_PATH);
  const model = useMemo(() => scene.clone(true), [scene]);
  const groupRef = useRef<Group>(null);

  const { camera, size } = useThree();

  // Нормализованное положение мыши: от -1 до 1 по обеим осям
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  // Центрируем модель и масштабируем так, чтобы она покрывала область кадра
  const { center, scale } = useMemo(() => {
    const bounds = new Box3().setFromObject(model);
    const center = bounds.getCenter(new Vector3());
    const dimensions = bounds.getSize(new Vector3());
    const zoom = 3.2;

    const cameraDistance = 5;
    const fov = 50;
    const viewHeight = 2 * cameraDistance * Math.tan((fov * Math.PI) / 360);
    const viewWidth = viewHeight * (size.width / size.height);

    const scale = Math.max(
      viewWidth / Math.max(dimensions.x, 0.001),
      viewHeight / Math.max(dimensions.y, 0.001),
    ) * zoom;

    return { center, scale };
  }, [model, size.width, size.height]);

  // Плавно догоняем положение мыши, а не поворачиваемся резко
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const targetRotationY = mouse.current.x * 0.09;
    const targetRotationX = -mouse.current.y * 0.09;
    const smoothing = 1 - Math.exp(-delta * 3);

    groupRef.current.rotation.y +=
      (targetRotationY - groupRef.current.rotation.y) * smoothing;

    groupRef.current.rotation.x +=
      (targetRotationX - groupRef.current.rotation.x) * smoothing;
  });

  // На случай изменения размеров экрана сохраняем актуальный aspect ratio
  useEffect(() => {
    if ("fov" in camera) {
      camera.fov = 50;
      camera.position.set(0, 0, 5);
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  return (
    <group scale={scale} 
            position={[-center.x * scale + 1.5, -center.y * scale + 1.2, -center.z * scale]}
            rotation={[0, Math.PI * 1.18, 0]}
    >
        <group ref={groupRef}> 
            <primitive object={model} />
        </group>
      
    </group>
  );
}

useGLTF.preload(MODEL_PATH);

export default function BackgroundScene() {
  return (
    <div className={styles.scene} aria-hidden="true">
      <Canvas
        className={styles.scene__canvas}
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.3} />
        <hemisphereLight
          intensity={1.1}
          color="#eaf3ff"
          groundColor="#26364c"
        />
        <directionalLight
          position={[5, 8, 6]}
          intensity={2}
          color="#fff4e6"
        />

        <FullscreenModel />
      </Canvas>
    </div>
  );
}