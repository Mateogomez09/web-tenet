import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text, Image } from '@react-three/drei';
import * as THREE from 'three';

export default function ProjectCanvas({ 
  position, 
  rotation = [0, 0, 0], 
  project, 
  isActive, 
  onSelect 
}) {
  const groupRef = useRef();
  const plaqueRef = useRef();
  const [hovered, setHovered] = useState(false);
  const targetScale = hovered && !isActive ? 1.05 : 1;

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
    }
    
    if (plaqueRef.current) {
      const targetOpacity = isActive ? 1.0 : (hovered ? 0.6 : 0.2);
      plaqueRef.current.material.opacity = THREE.MathUtils.lerp(plaqueRef.current.material.opacity, targetOpacity, delta * 5);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Interactive Project Canvas */}
      <group 
        ref={groupRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
        onClick={(e) => { e.stopPropagation(); onSelect(project); }}
      >
        {/* Frame / Canvas depth */}
        <RoundedBox args={[3, 4, 0.2]} radius={0.05} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color={hovered ? "#222" : "#111"} roughness={0.7} metalness={0.2} />
        </RoundedBox>

        {/* The artwork (Placeholder color) */}
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[2.8, 3.8]} />
          <meshStandardMaterial color={project.color} roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Descubrir más button below the canvas */}
        {!isActive && (
          <Text
            position={[0, -2.5, 0.1]}
            fontSize={0.15}
            color={hovered ? "#000000" : "#555555"}
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hjp-Ek-_EeA.woff"
            letterSpacing={0.1}
          >
            DESCUBRIR MÁS
          </Text>
        )}
      </group>

      {/* Spotlight that highlights the canvas when hovered or active */}
      <spotLight
        position={[0, 4, 3]}
        angle={0.6}
        penumbra={0.5}
        intensity={isActive ? 60 : (hovered ? 30 : 0)}
        distance={15}
        color={project.color}
      />
    </group>
  );
}
