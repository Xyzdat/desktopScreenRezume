import { Center, Float, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import styles from "./backgroundCharacter.module.scss";

const MODEL_PATH = "/models/christmas_sphere_environment.glb";


const SphereModel = () => {
    const { scene } = useGLTF(MODEL_PATH);
    const model = useMemo(() => scene.clone(), [scene]);

    return (
        <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.35}>
            <Center>
                <primitive object={model} />
            </Center>
        </Float>
    );
};

useGLTF.preload(MODEL_PATH);

const BackgroundCharacter = () => (
    <aside className={styles.character} aria-label="Интерактивная стеклянная сфера">
        <Canvas
            className={styles.character__canvas}
            camera={{ position: [0, 0, 5.2], fov: 40 }}
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: true }}
        >
            <ambientLight intensity={1.3} />
            <directionalLight position={[3, 4, 4]} intensity={2.8} color="#ffffff" />
            <pointLight position={[-3, -2, 3]} intensity={14} color="#8a8dff" />
            <pointLight position={[2, -1, -2]} intensity={8} color="#8fc8ff" />

            <SphereModel />

            <OrbitControls
                enablePan={false}
                enableZoom={false}
                autoRotate
                autoRotateSpeed={0.75}
                minPolarAngle={Math.PI / 3.1}
                maxPolarAngle={Math.PI / 1.75}
            />
        </Canvas>
        {/* <span className={styles.character__hint}>Потяните, чтобы повернуть</span> */}
    </aside>
);

export default BackgroundCharacter;
