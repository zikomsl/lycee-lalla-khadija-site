import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, PerspectiveCamera } from "@react-three/drei";
import { Robot } from "./Robot";
import { useApp } from "@/contexts/AppContext";
import { useFocus } from "@/contexts/FocusContext";
import { MathUtils, PerspectiveCamera as ThreePerspectiveCamera } from "three";

const CinematicCamera = () => {
  const camRef = useRef<ThreePerspectiveCamera>(null);
  const { active } = useFocus();
  const { viewport } = useThree();
  const isMobile = viewport.width < 5; // كنشوفو واش الشاشة صغيرة وسط الـ 3D

  useFrame((_, delta) => {
    const cam = camRef.current;
    if (!cam) return;
    const focused = !!active;

    // ف التيليفون (isMobile) كنرجعو الكاميرا لور (Z: 6) باش الروبوت يشد الوسط ناضي
    const targetX = focused ? 2.3 : 0;
    const targetY = focused ? 0.6 : (isMobile ? 0.2 : 0.4);
    const targetZ = focused ? 3.6 : (isMobile ? 6 : 4.5); 
    const targetRotY = focused ? -0.45 : 0;

    cam.position.x = MathUtils.damp(cam.position.x, targetX, 2.2, delta);
    cam.position.y = MathUtils.damp(cam.position.y, targetY, 2.2, delta);
    cam.position.z = MathUtils.damp(cam.position.z, targetZ, 2.2, delta);
    cam.rotation.y = MathUtils.damp(cam.rotation.y, targetRotY, 2.2, delta);
    cam.lookAt(0, focused ? 0.2 : 0.1, 0);
  });

  return <PerspectiveCamera ref={camRef} makeDefault fov={isMobile ? 50 : 42} />;
};

export const HeroScene = () => {
  const { theme } = useApp();
  const isDark = theme === "dark";

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]} // نقصنا شوية باش يخدم خفيف ف التيليفون
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
        />
        <Robot />
        <ContactShadows
          position={[0, -1.25, 0]}
          opacity={isDark ? 0.5 : 0.3}
          scale={8}
          blur={2.4}
          far={3}
        />
        <Environment preset={isDark ? "night" : "studio"} />
      </Suspense>
    </Canvas>
  );
};