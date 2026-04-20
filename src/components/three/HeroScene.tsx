import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, PerspectiveCamera } from "@react-three/drei";
import { Robot } from "./Robot";
import { useApp } from "@/contexts/AppContext";
import { useFocus } from "@/contexts/FocusContext";
import { MathUtils, PerspectiveCamera as ThreePerspectiveCamera } from "three";

const CinematicCamera = () => {
  const camRef = useRef<ThreePerspectiveCamera>(null);
  const { active } = useFocus();

  useFrame((_, delta) => {
    const cam = camRef.current;
    if (!cam) return;
    const focused = !!active;

    const targetX = focused ? 2.3 : 0;
    const targetY = focused ? 0.6 : 0.4;
    const targetZ = focused ? 3.6 : 4.5;
    const targetRotY = focused ? -0.45 : 0;

    cam.position.x = MathUtils.damp(cam.position.x, targetX, 2.2, delta);
    cam.position.y = MathUtils.damp(cam.position.y, targetY, 2.2, delta);
    cam.position.z = MathUtils.damp(cam.position.z, targetZ, 2.2, delta);
    cam.rotation.y = MathUtils.damp(cam.rotation.y, targetRotY, 2.2, delta);
    cam.lookAt(0, focused ? 0.2 : 0.1, 0);
  });

  return <PerspectiveCamera ref={camRef} makeDefault position={[0, 0.4, 4.5]} fov={42} />;
};

export const HeroScene = () => {
  const { theme } = useApp();
  const isDark = theme === "dark";

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="w-full h-full"
    >
      <CinematicCamera />
      <Suspense fallback={null}>
        <ambientLight intensity={isDark ? 0.25 : 0.6} />
        <directionalLight
          position={[4, 5, 3]}
          intensity={isDark ? 0.8 : 1.4}
          color={isDark ? "#67e8f9" : "#ffffff"}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-4, 2, -3]} intensity={isDark ? 0.6 : 0.4} color={isDark ? "#3b82f6" : "#cbd5e1"} />
        <pointLight position={[0, 1, 2]} intensity={isDark ? 1.2 : 0.5} color={isDark ? "#22d3ee" : "#60a5fa"} />

        <Robot />

        <ContactShadows
          position={[0, -1.25, 0]}
          opacity={isDark ? 0.5 : 0.3}
          scale={8}
          blur={2.4}
          far={3}
          color={isDark ? "#000000" : "#1e293b"}
        />
        <Environment preset={isDark ? "night" : "studio"} />
      </Suspense>
    </Canvas>
  );
};
