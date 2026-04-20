import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useFocus } from "@/contexts/FocusContext";

export const Robot = (props: any) => {
  const group = useRef<THREE.Group>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { active } = useFocus();
  
  const { scene, animations } = useGLTF('/new_robot.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    const actionNames = Object.keys(actions);
    if (actionNames.length > 0 && actions[actionNames[0]]) {
      actions[actionNames[0]]?.play();
    }

    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material.needsUpdate = true;
        
        if (child.material.emissive && child.material.emissive.getHex() !== 0x000000) {
          child.material.emissiveIntensity = 5;
          child.material.toneMapped = false;
        } else {
          child.material.roughness = 0.1;
          child.material.metalness = 0.3;
        }
      }
    });

    return () => window.removeEventListener('resize', handleResize);
  }, [actions, scene]);

  useFrame((state, delta) => {
    if (group.current) {
      if (!isMobile && !active) {
        const targetX = (state.pointer.x * Math.PI) / 8;
        const targetY = (state.pointer.y * Math.PI) / 10;
        group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetX, 12, delta);
        group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -targetY, 12, delta);
      } else {
        group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, 0, 12, delta);
        group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0, 12, delta);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.05} floatIntensity={0.2}>
      <group ref={group} {...props} visible={!active}>
        <primitive 
          object={scene} 
          scale={isMobile ? 1.5 : 2.5} 
          position={isMobile ? [0, 0, 0] : [0, -1.2, 0]} 
        />
      </group>
    </Float>
  );
};

useGLTF.preload('/new_robot.glb');