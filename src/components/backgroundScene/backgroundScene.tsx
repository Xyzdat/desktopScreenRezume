import { Bounds, Center, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import styles from "./backgroundScene.module.scss";

const MODEL_PATH = "/models/sea_keep_lonely_watcher.glb";

const LandscapeModel = () => {
    const { scene } = useGLTF(MODEL_PATH);
    const model = useMemo(() => scene.clone(), [scene]);

    return (
        <Bounds fit clip observe margin={1.08}>
            <Center>
                <primitive object={model} />
            </Center>
        </Bounds>
    );
};

useGLTF.preload(MODEL_PATH);

const BackgroundScene = () => (
    <div className={styles.scene} aria-hidden="true">
        <Canvas
            className={styles.scene__canvas}
            camera={{ position: [0, 0, 5], fov: 42 }}
            dpr={[1, 1.25]}
            frameloop="demand"
            gl={{ antialias: true }}
        >
            <color attach="background" args={["#9ebbd7"]} />
            <hemisphereLight intensity={1.6} color="#e9f4ff" groundColor="#29425f" />
            <directionalLight position={[7, 10, 5]} intensity={2.2} color="#fff4e6" />

            <Suspense fallback={null}>
                <LandscapeModel />
            </Suspense>
        </Canvas>
    </div>
);

export default BackgroundScene;
