import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Sphere, Torus } from "@react-three/drei";
import { Group, MathUtils, MeshStandardMaterial } from "three";
import { useApp } from "@/contexts/AppContext";

/**
 * Sleek humanoid robot — head, torso, shoulders, arms, glowing core/eyes.
 * Magnetic mouse tracking with elastic limbs.
 */
export const Robot = () => {
  const { theme } = useApp();
  const root = useRef<Group>(null);
  const head = useRef<Group>(null);
  const torso = useRef<Group>(null);
  const armL = useRef<Group>(null);
  const armR = useRef<Group>(null);
  const ringRef = useRef<Group>(null);
  const { mouse } = useThree();

  const eyeColor = theme === "dark" ? "#22d3ee" : "#3b82f6";
  const bodyColor = theme === "dark" ? "#0b1220" : "#f1f5f9";
  const metalColor = theme === "dark" ? "#1e293b" : "#cbd5e1";
  const accentColor = theme === "dark" ? "#67e8f9" : "#0ea5e9";

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const mx = mouse.x;
    const my = mouse.y;

    if (root.current) {
      root.current.position.y = Math.sin(t * 0.8) * 0.08;
      root.current.rotation.y = MathUtils.damp(root.current.rotation.y, mx * 0.5, 4, delta);
    }
    if (head.current) {
      head.current.rotation.x = MathUtils.damp(head.current.rotation.x, -my * 0.4, 6, delta);
      head.current.rotation.y = MathUtils.damp(head.current.rotation.y, mx * 0.6, 6, delta);
    }
    if (torso.current) {
      torso.current.rotation.x = MathUtils.damp(torso.current.rotation.x, -my * 0.15, 4, delta);
      torso.current.rotation.z = MathUtils.damp(torso.current.rotation.z, -mx * 0.1, 4, delta);
    }
    if (armL.current) {
      armL.current.rotation.x = MathUtils.damp(armL.current.rotation.x, -my * 0.6 + Math.sin(t * 1.2) * 0.05, 3, delta);
      armL.current.rotation.z = MathUtils.damp(armL.current.rotation.z, 0.35 + mx * 0.3, 3, delta);
    }
    if (armR.current) {
      armR.current.rotation.x = MathUtils.damp(armR.current.rotation.x, -my * 0.6 + Math.sin(t * 1.2 + 1) * 0.05, 3, delta);
      armR.current.rotation.z = MathUtils.damp(armR.current.rotation.z, -0.35 + mx * 0.3, 3, delta);
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.4;
      ringRef.current.rotation.y = t * 0.6;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={root} position={[0, -0.3, 0]}>
        {/* Halo rings around */}
        <group ref={ringRef}>
          <Torus args={[1.8, 0.012, 16, 80]}>
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.5} toneMapped={false} />
          </Torus>
          <Torus args={[2.1, 0.008, 16, 80]} rotation={[Math.PI / 2.5, 0, 0]}>
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.2} toneMapped={false} />
          </Torus>
        </group>

        {/* Head */}
        <group ref={head} position={[0, 0.95, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.42, 64, 64]} />
            <meshPhysicalMaterial
              color={bodyColor}
              metalness={0.6}
              roughness={0.18}
              clearcoat={1}
              clearcoatRoughness={0.05}
            />
          </mesh>
          {/* Visor */}
          <mesh position={[0, 0.02, 0.32]} rotation={[0, 0, 0]}>
            <sphereGeometry args={[0.32, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
            <meshPhysicalMaterial
              color="#0a0f1a"
              metalness={1}
              roughness={0.05}
              clearcoat={1}
              transmission={0.1}
            />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.13, 0.02, 0.39]}>
            <sphereGeometry args={[0.045, 32, 32]} />
            <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={3} toneMapped={false} />
          </mesh>
          <mesh position={[0.13, 0.02, 0.39]}>
            <sphereGeometry args={[0.045, 32, 32]} />
            <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={3} toneMapped={false} />
          </mesh>
          {/* Antenna */}
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.18, 16]} />
            <meshStandardMaterial color={metalColor} metalness={1} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.62, 0]}>
            <sphereGeometry args={[0.04, 24, 24]} />
            <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={2} toneMapped={false} />
          </mesh>
        </group>

        {/* Neck */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.1, 0.13, 0.18, 24]} />
          <meshStandardMaterial color={metalColor} metalness={0.9} roughness={0.25} />
        </mesh>

        {/* Torso */}
        <group ref={torso} position={[0, 0.05, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.85, 0.95, 0.5]} />
            <meshPhysicalMaterial
              color={bodyColor}
              metalness={0.55}
              roughness={0.22}
              clearcoat={1}
              clearcoatRoughness={0.08}
            />
          </mesh>
          {/* Chest core */}
          <mesh position={[0, 0.1, 0.26]}>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={2.5} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0.1, 0.255]}>
            <torusGeometry args={[0.18, 0.012, 16, 64]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.5} toneMapped={false} />
          </mesh>
          {/* Chest panel lines */}
          <mesh position={[0, -0.3, 0.252]}>
            <boxGeometry args={[0.4, 0.02, 0.005]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.2} toneMapped={false} />
          </mesh>
        </group>

        {/* Shoulders + Arms */}
        <group ref={armL} position={[-0.55, 0.4, 0]}>
          <mesh>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshStandardMaterial color={metalColor} metalness={0.95} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <capsuleGeometry args={[0.08, 0.45, 8, 16]} />
            <meshPhysicalMaterial color={bodyColor} metalness={0.5} roughness={0.25} clearcoat={0.8} />
          </mesh>
          <mesh position={[0, -0.7, 0]}>
            <sphereGeometry args={[0.085, 24, 24]} />
            <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={1.5} toneMapped={false} />
          </mesh>
        </group>
        <group ref={armR} position={[0.55, 0.4, 0]}>
          <mesh>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshStandardMaterial color={metalColor} metalness={0.95} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <capsuleGeometry args={[0.08, 0.45, 8, 16]} />
            <meshPhysicalMaterial color={bodyColor} metalness={0.5} roughness={0.25} clearcoat={0.8} />
          </mesh>
          <mesh position={[0, -0.7, 0]}>
            <sphereGeometry args={[0.085, 24, 24]} />
            <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={1.5} toneMapped={false} />
          </mesh>
        </group>

        {/* Base pedestal */}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.5, 0.6, 0.1, 48]} />
          <meshStandardMaterial color={metalColor} metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.65, 0]}>
          <torusGeometry args={[0.55, 0.01, 16, 80]} />
          <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
};
