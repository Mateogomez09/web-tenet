import React from 'react';
import * as THREE from 'three';

// Museum-grade Architectural Maquette Display
export default function ArchitecturalWorkspace({ position, rotation = [0, 0, 0], scale = 1 }) {
  // Materials
  const woodMaterial = <meshStandardMaterial color="#a0785a" roughness={0.6} />;
  const plasterMaterial = <meshStandardMaterial color="#fcfbf9" roughness={0.95} metalness={0.0} />;
  const darkMetalMaterial = <meshStandardMaterial color="#222222" roughness={0.5} metalness={0.8} />;
  const glassMaterial = (
    <meshPhysicalMaterial 
      color="#e0f0ff" 
      transmission={0.95} 
      opacity={1} 
      metalness={0.1} 
      roughness={0.05} 
      ior={1.5} 
      thickness={0.05} 
    />
  );
  const poolMaterial = <meshStandardMaterial color="#44aaff" roughness={0.2} metalness={0.8} />;
  const paperMaterial = <meshStandardMaterial color="#fcfcfc" roughness={0.9} />;
  const blueprintMaterial = <meshStandardMaterial color="#2a4570" roughness={0.9} />;
  const pencilYellow = <meshStandardMaterial color="#f4c542" roughness={0.6} />;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* --- 1. THE WORK TABLE --- */}
      {/* Table Top */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.05, 1.7]} />
        <meshStandardMaterial color="#151515" roughness={0.6} />
      </mesh>
      
      {/* Table Legs */}
      <mesh position={[-1.1, 0.35, -0.75]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.7, 0.06]} />
        {darkMetalMaterial}
      </mesh>
      <mesh position={[1.1, 0.35, -0.75]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.7, 0.06]} />
        {darkMetalMaterial}
      </mesh>
      <mesh position={[-1.1, 0.35, 0.75]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.7, 0.06]} />
        {darkMetalMaterial}
      </mesh>
      <mesh position={[1.1, 0.35, 0.75]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.7, 0.06]} />
        {darkMetalMaterial}
      </mesh>
      {/* Side Horizontal Bars to clearly show 4-leg structure */}
      <mesh position={[-1.1, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.04, 0.04, 1.5]} />
        {darkMetalMaterial}
      </mesh>
      <mesh position={[1.1, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.04, 0.04, 1.5]} />
        {darkMetalMaterial}
      </mesh>

      {/* --- 3. THE ARCHITECTURAL MAQUETTE --- */}
      {/* Baseplate placed in the center of the table */}
      <group position={[0, 0.725, 0]}>
        {/* Wooden Baseplate */}
        <mesh position={[0, 0.01, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.02, 1.4]} />
          {woodMaterial}
        </mesh>
        
        {/* Maquette Group */}
        <group position={[0, 0.02, 0]} scale={0.9}>
          
          {/* Base Plaster Platform (Extended to the left for the tree) */}
          <mesh position={[-0.1, 0.025, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.05, 1.2]} />
            <meshStandardMaterial color="#e8e6e1" roughness={0.9} />
          </mesh>

          {/* Infinity Pool (Front-right) */}
          <mesh position={[0.45, 0.051, 0.35]} receiveShadow>
            <boxGeometry args={[0.4, 0.01, 0.3]} />
            {poolMaterial}
          </mesh>
          
          {/* Main Structural Core (Concrete) */}
          <mesh position={[0.1, 0.25, -0.2]} castShadow receiveShadow>
            <boxGeometry args={[0.6, 0.4, 0.4]} />
            <meshStandardMaterial color="#666666" roughness={0.9} />
          </mesh>

          {/* Ground Floor Plaster Wall (Right Side) */}
          <mesh position={[0.45, 0.25, -0.2]} castShadow receiveShadow>
            <boxGeometry args={[0.1, 0.4, 0.4]} />
            {plasterMaterial}
          </mesh>

          {/* Ground Floor Plaster Wall (Left Front) */}
          <mesh position={[-0.45, 0.25, 0.15]} castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.4, 0.04]} />
            {plasterMaterial}
          </mesh>

          {/* Ground Floor Plaster Wall (Left Side) */}
          <mesh position={[-0.68, 0.25, -0.05]} castShadow receiveShadow>
            <boxGeometry args={[0.04, 0.4, 0.4]} />
            {plasterMaterial}
          </mesh>

          {/* Front Door (Wood) - Correct scale and no z-fighting */}
          <mesh position={[-0.45, 0.15, 0.175]} castShadow receiveShadow>
            <boxGeometry args={[0.16, 0.25, 0.01]} />
            {woodMaterial}
          </mesh>

          {/* Ground Floor Glass Living Area (Right Front) */}
          <mesh position={[0.05, 0.25, 0.15]} castShadow={false} receiveShadow>
            <boxGeometry args={[0.5, 0.4, 0.02]} />
            {glassMaterial}
          </mesh>
          
          {/* Back Glass */}
          <mesh position={[-0.2, 0.25, -0.26]} castShadow={false} receiveShadow>
            <boxGeometry args={[0.9, 0.4, 0.02]} />
            {glassMaterial}
          </mesh>

          {/* First Floor Cantilevered Slab (Roof of ground floor) */}
          <mesh position={[-0.05, 0.475, 0.05]} castShadow receiveShadow>
            <boxGeometry args={[1.4, 0.05, 0.8]} />
            {plasterMaterial}
          </mesh>

          {/* Second Floor Main Volume (Plaster) */}
          <mesh position={[-0.1, 0.65, -0.1]} castShadow receiveShadow>
            <boxGeometry args={[1.0, 0.3, 0.5]} />
            {plasterMaterial}
          </mesh>

          {/* Second Floor Glass Window (Front) */}
          <mesh position={[-0.1, 0.65, 0.16]} castShadow={false} receiveShadow>
            <boxGeometry args={[0.9, 0.2, 0.02]} />
            {glassMaterial}
          </mesh>

          {/* Vertical Window Mullions (Frames) */}
          <mesh position={[-0.325, 0.65, 0.17]} castShadow receiveShadow>
            <boxGeometry args={[0.015, 0.2, 0.02]} />
            {darkMetalMaterial}
          </mesh>
          <mesh position={[-0.1, 0.65, 0.17]} castShadow receiveShadow>
            <boxGeometry args={[0.015, 0.2, 0.02]} />
            {darkMetalMaterial}
          </mesh>
          <mesh position={[0.125, 0.65, 0.17]} castShadow receiveShadow>
            <boxGeometry args={[0.015, 0.2, 0.02]} />
            {darkMetalMaterial}
          </mesh>

          {/* Second Floor Dark Metal Roof */}
          <mesh position={[-0.1, 0.825, -0.05]} castShadow receiveShadow>
            <boxGeometry args={[1.1, 0.05, 0.6]} />
            {darkMetalMaterial}
          </mesh>

          {/* Slender Pillars supporting the cantilever on the left */}
          <mesh position={[-0.65, 0.25, 0.35]} castShadow receiveShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.4]} />
            {darkMetalMaterial}
          </mesh>
          <mesh position={[-0.2, 0.25, 0.35]} castShadow receiveShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.4]} />
            {darkMetalMaterial}
          </mesh>

          {/* Tree (Moved fully outside to the left on the extended platform) */}
          <group position={[-0.85, 0.05, 0.1]}>
            <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.01, 0.015, 0.2]} />
              <meshStandardMaterial color="#4a3b2c" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#446633" roughness={0.9} />
            </mesh>
          </group>
          
          {/* Decorative shrubs */}
          <mesh position={[0.55, 0.06, 0.0]} castShadow receiveShadow>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#446633" roughness={0.9} />
          </mesh>

        </group>
      </group>

      {/* --- 4. LIGHTING --- */}
      {/* Bright desk lamp style spotlight hitting the workspace */}
      <spotLight 
        position={[-0.8, 3.5, 0.5]} 
        intensity={3.0} 
        color="#ffffff" 
        distance={6} 
        angle={Math.PI / 4} 
        penumbra={0.5} 
        castShadow 
      />
    </group>
  );
}
