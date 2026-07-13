import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, RoundedBox, Text, RenderTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import ArchitecturalWorkspace from './ArchitecturalWorkspace';
import { neonAudio } from '../utils/neonAudio';
import ProjectCanvas from './ProjectCanvas';

const projectsData = [
  { id: 1, title: 'CASA SERRANO', category: 'RESIDENCIAL', description: 'Una reforma integral que busca maximizar la luz natural y el flujo de los espacios.', year: '2023', client: 'Privado', color: '#8b9487', position: [38, 2.5, -3.8] },
  { id: 2, title: 'OFICINAS NEXUS', category: 'CORPORATIVO', description: 'Espacio de trabajo colaborativo diseñado para fomentar la innovación.', year: '2024', client: 'Nexus Group', color: '#7a8194', position: [32, 2.5, -3.8] },
  { id: 3, title: 'VILLA BELLA', category: 'RESIDENCIAL', description: 'Lujo y minimalismo mediterráneo fundidos en un único plano continuo.', year: '2022', client: 'Privado', color: '#948a7a', position: [26, 2.5, -3.8] },
  { id: 4, title: 'ATELIER NOIR', category: 'COMERCIAL', description: 'Boutique conceptual donde la textura y el silencio dominan la experiencia.', year: '2025', client: 'Noir Brand', color: '#1a1a1a', position: [20, 2.5, -3.8] }
];

// Helper for solid structural blocks
function Block({ position, scale, color = "#151515", castShadow = true, receiveShadow = true }) {
  return (
    <mesh position={position} scale={scale} castShadow={castShadow} receiveShadow={receiveShadow}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0.1} />
    </mesh>
  );
}

// Premium Furniture with rounded edges
function Furniture({ position, scale, color, radius = 0.05 }) {
  return (
    <RoundedBox args={scale} position={position} radius={radius} smoothness={4} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.8} />
    </RoundedBox>
  );
}

// Animated TV Screen with Brand Identity
function AnimatedTV({ position, scale }) {
  const scroll = useScroll();
  const materialRef = useRef();
  const tvLightRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const offset = scroll.offset || 0;
    if (materialRef.current) {
      // Subtle glow/flicker effect simulating a real screen
      materialRef.current.opacity = 0.85 + Math.sin(t * 15) * 0.05 + Math.random() * 0.05;
    }
    if (tvLightRef.current) {
      // Direct mutation of TV backlight (Starts with a rich ambient glow of 5.0, and increases to 10.0 when scrolled)
      tvLightRef.current.intensity = offset >= 0.05 ? 10.0 : 5.0;
    }
  });

  return (
    <group position={position} rotation={[0, Math.PI, 0]}>
      {/* TV Bezel */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[scale[0] + 0.1, scale[1] + 0.1, 0.1]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Soundbar / TV Mount Base */}
      <mesh position={[0, -scale[1]/2 - 0.15, -0.05]}>
        <boxGeometry args={[scale[0] * 0.8, 0.15, 0.1]} />
        <meshStandardMaterial color="#111" roughness={0.4} metalness={0.8} />
      </mesh>
      
      {/* TV Screen */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[scale[0] - 0.1, scale[1] - 0.1]} />
        <meshBasicMaterial ref={materialRef} transparent opacity={0.9} color="#ffffff">
          <RenderTexture attach="map" anisotropy={16}>
            <color attach="background" args={['#050505']} />
            <PerspectiveCamera makeDefault manual aspect={(scale[0]-0.1) / (scale[1]-0.1)} position={[0, 0, 3]} />
            
            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 10]} intensity={2} />
            
            <group>
              <Text position={[0, 0, 0]} fontSize={0.6} color="#ffffff" letterSpacing={0.2} anchorY="middle" anchorX="center">TENET</Text>
            </group>
          </RenderTexture>
        </meshBasicMaterial>
      </mesh>
      
      {/* Screen Glow */}
      <pointLight ref={tvLightRef} position={[0, 0, -0.08]} intensity={5.0} color="#ffb070" distance={15} />
    </group>
  );
}

export default function ArchitecturalScene({ activeTab, activeProject, setActiveProject }) {
  const scroll = useScroll();
  const sceneGroup = useRef();
  const { camera, scene, size } = useThree();
  const isMobile = size.width < 768;

  // Performance Fix: Pre-allocated vector for garbage collection
  const scratchTargetLookAt = useRef(new THREE.Vector3(0, 1.5, 5)).current;

  // Performance Fix: Update Projection Matrix only on resize
  useEffect(() => {
    const aspect = size.width / size.height;
    if (aspect < 0.8) {
      camera.fov = 58;
    } else if (aspect < 1.2) {
      camera.fov = 50;
    } else {
      camera.fov = 45;
    }
    camera.updateProjectionMatrix();
  }, [size.width, size.height, camera]);

  // Refs for direct lighting manipulation (high-performance flickers)
  const ambientLightRef = useRef();
  const roomLightRef = useRef();
  const lampLightRef = useRef();
  const artLightRef = useRef();
  const shelfLightRef = useRef();
  const ceilingLightRef = useRef();
  const corridorLightsRef = useRef([]);
  
  // High-reliability 360-degree pointLight for the Contact Room
  const contactLightRef = useRef();
  const contactFillLightRef = useRef();

  // Tactile light switch state on scroll
  const lightsState = useRef({ on: false, intensity: 0.0, lastTriggerTime: 0 });
  const lastTabChangeTime = useRef(0);
  const prevTabRef = useRef(activeTab);

  // Gallery Lights Refs
  const galleryAmbientRef = useRef();
  const galleryDirRef = useRef();

  // Initialize camera and static atmosphere
  useEffect(() => {
    scene.background = new THREE.Color('#050505');
    scene.fog = new THREE.Fog('#050505', 2, 40);
    
    if (!camera.userData.currentLookAt) {
      camera.userData.currentLookAt = new THREE.Vector3(0, 1.5, 5);
    }
  }, [camera, scene]);

  // Reset scroll position to top when activeTab changes (guarantees returning to start in Home)
  useEffect(() => {
    if (scroll) {
      if (scroll.el) {
        scroll.el.scrollTop = 0;
      }
      scroll.offset = 0;
      if (scroll.scroll) {
        scroll.scroll.current = 0;
      }
    }
  }, [activeTab, scroll]);

  useFrame((state, delta) => {
    const offset = scroll?.offset || 0;
    const isContact = activeTab === 'contacto';
    const isProyectos = activeTab === 'proyectos';
    const lights = lightsState.current;

    // --- Tab Change Tracker ---
    // Detects navigation changes to suppress scroll-reset ignition sounds during transitions
    if (prevTabRef.current !== activeTab) {
      prevTabRef.current = activeTab;
      lastTabChangeTime.current = state.clock.elapsedTime;
    }
    const timeSinceTabChange = state.clock.elapsedTime - lastTabChangeTime.current;

    // --- Tactile Neon Light Switch Logic ---
    if (!isContact && !isProyectos) {
      if (offset >= 0.05 && !lights.on) {
        lights.on = true;
        lights.lastTriggerTime = state.clock.elapsedTime;
        // Suppress spark ignition sound when returning from another tab (1.0s window)
        if (timeSinceTabChange > 1.0) {
          neonAudio.triggerOn();
        }
      } else if (offset < 0.05 && lights.on) {
        lights.on = false;
        lights.lastTriggerTime = state.clock.elapsedTime;
        // Suppress spark release sound when returning from another tab (1.0s window)
        if (timeSinceTabChange > 1.0) {
          neonAudio.triggerOff();
        }
      }
    } else {
      // Hard reset main lights state when inside Contact Room
      lights.on = false;
    }

    // Calculate smooth lighting (Removed tactile flicker logic per user request)
    if (lights.on) {
      lights.intensity = THREE.MathUtils.damp(lights.intensity, 1.0, 4, delta);
    } else {
      lights.intensity = THREE.MathUtils.damp(lights.intensity, 0.0, 6, delta);
    }

    // --- Scene Lights Multiplier for Contact Room Transition ---
    // Smoothly fade down all main house lights when transitioning into the contact room
    if (sceneGroup.current.sceneMultiplier === undefined) {
      sceneGroup.current.sceneMultiplier = 1.0;
      sceneGroup.current.contactLightIntensity = 0.0;
      sceneGroup.current.galleryLightIntensity = 0.0;
    }

    sceneGroup.current.sceneMultiplier = THREE.MathUtils.damp(
      sceneGroup.current.sceneMultiplier,
      (isContact || isProyectos) ? 0.0 : 1.0,
      4.5,
      delta
    );

    // Warm, luxury illumination intensity for the Contact Room
    sceneGroup.current.contactLightIntensity = THREE.MathUtils.damp(
      sceneGroup.current.contactLightIntensity,
      isContact ? 25.0 : 0.0,
      4.5,
      delta
    );

    // Gallery lighting
    sceneGroup.current.galleryLightIntensity = THREE.MathUtils.damp(
      sceneGroup.current.galleryLightIntensity,
      isProyectos ? 1.0 : 0.0,
      4.5,
      delta
    );

    // Dynamic gallery lights update (reduced intensity because walls are now white)
    if (galleryAmbientRef.current) {
      galleryAmbientRef.current.intensity = sceneGroup.current.galleryLightIntensity * 1.5; // Ambient
    }
    if (galleryDirRef.current) {
      galleryDirRef.current.intensity = sceneGroup.current.galleryLightIntensity * 2.5; // Directional
    }

    // Direct lighting mutation with multiplier
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = (0.3 + lights.intensity * 1.5) * sceneGroup.current.sceneMultiplier;
    }
    if (roomLightRef.current) {
      roomLightRef.current.intensity = (lights.intensity * 0.8) * sceneGroup.current.sceneMultiplier;
    }
    if (lampLightRef.current) {
      lampLightRef.current.intensity = (lights.intensity * 1.5) * sceneGroup.current.sceneMultiplier;
    }
    if (artLightRef.current) {
      artLightRef.current.intensity = (lights.intensity * 0.8) * sceneGroup.current.sceneMultiplier;
    }
    if (shelfLightRef.current) {
      shelfLightRef.current.intensity = (lights.intensity * 0.2) * sceneGroup.current.sceneMultiplier;
    }
    if (ceilingLightRef.current) {
      ceilingLightRef.current.intensity = (lights.intensity * 0.8) * sceneGroup.current.sceneMultiplier;
    }
    corridorLightsRef.current.forEach((light) => {
      if (light) {
        light.intensity = (lights.intensity * 3.0) * sceneGroup.current.sceneMultiplier;
      }
    });

    // Control contact room light intensity
    if (contactLightRef.current) {
      contactLightRef.current.intensity = sceneGroup.current.contactLightIntensity;
    }
    if (contactFillLightRef.current) {
      contactFillLightRef.current.intensity = sceneGroup.current.contactLightIntensity * 0.55; // Beautiful ambient fill
    }

    // --- Responsive Camera Tuning ---
    // --- Responsive Camera Tuning Removed from useFrame ---
    // (Now handled in the useEffect above)

    // --- Camera Positioning & Looking Direction ---
    let targetX = 0;
    let targetY = 1.5;
    let targetZ = 3;
    scratchTargetLookAt.set(0, 1.5, 5);

    if (isContact) {
      // Wide architectural view of the reception desk from the customer's perspective
      // Shifted left (negative X) to frame the desk to the right, balancing the left UI panel
      targetX = -15.5;
      targetY = 1.2;
      targetZ = -9.5; 
      scratchTargetLookAt.set(-15.8, 0.6, -13.0);
    } else if (isProyectos) {
      if (activeProject) {
        // Extreme dive directly into the artwork
        const targetPicX = activeProject.position[0];
        const targetPicY = activeProject.position[1]; 
        const targetPicZ = activeProject.position[2];
        
        const dist = 0.05; // Dive right into the canvas surface!
        targetX = targetPicX;
        targetY = targetPicY;
        targetZ = targetPicZ + dist;
        scratchTargetLookAt.set(targetPicX, targetPicY, targetPicZ);
      } else {
        if (offset < 0.25) {
          // Fase 1: Entrada cinematográfica a la galería
          // Empezamos muchísimo más lejos (X: 56, Z: 6) viendo toda la sala
          const progress = offset / 0.25;
          const smooth = progress * progress * (3 - 2 * progress); // Ease in-out
          const startZ = isMobile ? 9.0 : 6.0;
          const startX = isMobile ? 60.0 : 54.0;
          targetX = THREE.MathUtils.lerp(startX, 38, smooth);
          targetY = THREE.MathUtils.lerp(2.8, 1.8, smooth);
          targetZ = THREE.MathUtils.lerp(startZ, 3.8, smooth);
          
          scratchTargetLookAt.set(
            THREE.MathUtils.lerp(20, 38, smooth), 
            THREE.MathUtils.lerp(1.5, 1.8, smooth),
            THREE.MathUtils.lerp(-3.8, -4, smooth)
          );
        } else {
          // Fase 2: Desplazamiento lateral a lo largo de los cuadros (Scroll)
          const progress = (offset - 0.25) / 0.75;
          targetX = THREE.MathUtils.lerp(38, 18, progress);
          targetY = 1.8;
          targetZ = 3.8; // Mucho más lejos (antes 2.0) para que se vean enteros los cuadros
          scratchTargetLookAt.set(targetX, 1.8, -4); 
        }
      }
    } else {
      // --- Baseline Camera Coordinates (Existing Scroll-based logic) ---
      let lookDirAngle = 0;
      let pullbackStart = 3;
      let pullbackEnd = 1.5;
      let pauseZ = 1.5;
      let pauseX = 0;

      // We need aspect here for the scroll logic, let's recalculate it lightly
      const aspect = state.size.width / state.size.height;
      if (aspect < 0.8) {
        pullbackStart = 2.0;
        pullbackEnd = 0.5;
        pauseZ = 2.2;
        pauseX = -1.2;
      } else if (aspect < 1.2) {
        pullbackStart = 2.5;
        pullbackEnd = 1.0;
        pauseZ = 1.8;
        pauseX = -0.6;
      }

      if (offset < 1 / 7) {
        const progress = offset / (1 / 7);
        const smoothProgress = 1 - Math.pow(1 - progress, 3);
        targetZ = THREE.MathUtils.lerp(pullbackStart, pullbackEnd, smoothProgress);
        targetX = 0;
        lookDirAngle = 0;
      } else if (offset < 2 / 7) {
        const progress = (offset - 1 / 7) / (1 / 7);
        const smoothProgress = progress * progress * (3 - 2 * progress);
        targetZ = THREE.MathUtils.lerp(pullbackEnd, pauseZ, smoothProgress);
        targetX = THREE.MathUtils.lerp(0, pauseX, smoothProgress);
        lookDirAngle = THREE.MathUtils.lerp(0, Math.PI / 2, smoothProgress);
      } else if (offset < 3.5 / 7) {
        targetZ = pauseZ;
        targetX = pauseX;
        lookDirAngle = Math.PI / 2;
      } else if (offset < 4.25 / 7) {
        const progress = (offset - 3.5 / 7) / (0.75 / 7);
        const smoothProgress = progress * progress * (3 - 2 * progress);
        targetZ = THREE.MathUtils.lerp(pauseZ, 1.5, smoothProgress);
        targetX = THREE.MathUtils.lerp(pauseX, 0, smoothProgress);
        lookDirAngle = THREE.MathUtils.lerp(Math.PI / 2, Math.PI, smoothProgress);
      } else {
        const progress = (offset - 4.25 / 7) / (2.75 / 7);
        targetZ = THREE.MathUtils.lerp(1.5, -90, progress);
        targetX = 0;
        lookDirAngle = Math.PI;
      }

      const lookDistance = 5;
      const lookX = targetX + Math.sin(lookDirAngle) * lookDistance;
      const lookZ = targetZ + Math.cos(lookDirAngle) * lookDistance;
      const lookY = 1.5;
      scratchTargetLookAt.set(lookX, lookY, lookZ);
    }

    // Damp camera position and looking target for seamless flight transitions
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 3.5, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 3.5, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 3.5, delta);

    if (!state.camera.userData.currentLookAt) {
      state.camera.userData.currentLookAt = new THREE.Vector3(scratchTargetLookAt.x, scratchTargetLookAt.y, scratchTargetLookAt.z);
    }
    state.camera.userData.currentLookAt.x = THREE.MathUtils.damp(state.camera.userData.currentLookAt.x, scratchTargetLookAt.x, 3.5, delta);
    state.camera.userData.currentLookAt.y = THREE.MathUtils.damp(state.camera.userData.currentLookAt.y, scratchTargetLookAt.y, 3.5, delta);
    state.camera.userData.currentLookAt.z = THREE.MathUtils.damp(state.camera.userData.currentLookAt.z, scratchTargetLookAt.z, 3.5, delta);
    state.camera.lookAt(state.camera.userData.currentLookAt);
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0.35} color="#ffffff" />

      {/* Premium Cinematic Post Processing */}
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={1.5} mipmapBlur intensity={0.5} />
        <Noise opacity={0.012} />
        <Vignette eskil={false} offset={0.15} darkness={0.4} />
      </EffectComposer>

      <group ref={sceneGroup}>
        {/* ===================================== */}
        {/* ROOM: BRIGHT GALLERY LOUNGE           */}
        {/* ===================================== */}
        
        {/* Room Floor - Light microcement */}
        <mesh position={[0, -0.5, 2.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[14, 16]} />
          <meshStandardMaterial color="#d4d2cc" roughness={0.4} metalness={0.05} />
        </mesh>
        
        {/* Room Ceiling */}
        <Block position={[0, 7.5, 2.5]} scale={[14, 1, 16]} color="#ffffff" />

        {/* Room Left Wall */}
        <Block position={[-6.5, 3.5, 2.5]} scale={[1, 8, 16]} color="#e8e6e1" />
        
        {/* Room Right Wall */}
        <Block position={[6.5, 3.5, 2.5]} scale={[1, 8, 16]} color="#e8e6e1" />

        {/* Room Back Wall */}
        <Block position={[0, 3.5, 10.5]} scale={[14, 8, 1]} color="#e8e6e1" />
        
        {/* Animated Brand TV Screen */}
        <AnimatedTV position={[0, 1.9, 9.9]} scale={[4, 2.5]} />

        {/* Elegant Designer Floor Lamp */}
        <group position={[-5, -0.5, 9]}>
          <Block position={[0, 0.05, 0]} scale={[0.4, 0.1, 0.4]} color="#e0deda" />
          <Block position={[0, 1.5, 0]} scale={[0.06, 3.0, 0.06]} color="#d9c5a0" />
          <mesh position={[0, 3.0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.5, 16]} />
            <meshStandardMaterial color="#fff6e0" roughness={0.9} emissive="#fff6e0" emissiveIntensity={0.2} />
          </mesh>
          <pointLight ref={lampLightRef} position={[0, 2.8, 0]} intensity={0.5} color="#ffaa66" distance={8} castShadow />
        </group>

        {/* Premium 3D Framed Abstract Painting (on the right wall) */}
        <group position={[5.98, 1.9, 2.5]}>
          <Block position={[-0.02, 0.84, 0]} scale={[0.06, 0.08, 1.4]} color="#2a1b12" castShadow={false} />
          <Block position={[-0.02, -0.84, 0]} scale={[0.06, 0.08, 1.4]} color="#2a1b12" castShadow={false} />
          <Block position={[-0.02, 0, -0.66]} scale={[0.06, 1.76, 0.08]} color="#2a1b12" castShadow={false} />
          <Block position={[-0.02, 0, 0.66]} scale={[0.06, 1.76, 0.08]} color="#2a1b12" castShadow={false} />
          
          <mesh position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
            <planeGeometry args={[1.26, 1.61]} />
            <meshStandardMaterial color="#f0eee9" roughness={1.0} />
          </mesh>

          <Block position={[-0.01, 0.15, -0.15]} scale={[0.01, 0.84, 0.56]} color="#d9c5a0" castShadow={false} />
          <Block position={[-0.015, -0.2, 0.2]} scale={[0.01, 0.56, 0.42]} color="#e8e6e1" castShadow={false} />

          {/* LED Picture Light Bar */}
          <Block position={[-0.2, 0.94, -0.2]} scale={[0.4, 0.02, 0.02]} color="#1a1a1a" castShadow={false} />
          <Block position={[-0.2, 0.94, 0.2]} scale={[0.4, 0.02, 0.02]} color="#1a1a1a" castShadow={false} />
          <mesh position={[-0.4, 0.94, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow={false}>
            <cylinderGeometry args={[0.03, 0.03, 0.84, 8]} />
            <meshStandardMaterial color="#111111" roughness={0.5} />
          </mesh>
          <mesh position={[-0.39, 0.92, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.77, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <pointLight ref={artLightRef} position={[-0.4, 0.8, 0]} intensity={0} color="#ffffff" distance={8} />
        </group>

        {/* Premium Recessed Shelf Niche */}
        <group position={[5.95, 1.5, 5.5]}>
          <Block position={[-0.05, -0.25, 0]} scale={[0.8, 0.06, 2.0]} color="#f0eee9" />
          <Block position={[-0.05, 0.25, 0]} scale={[0.8, 0.06, 2.0]} color="#f0eee9" />
          <mesh position={[0.03, 0, 0]} scale={[0.04, 0.44, 2.0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#ffffff" roughness={1.0} metalness={0.0} />
          </mesh>
          
          <Block position={[-0.1, -0.2, 0]} scale={[0.2, 0.04, 0.2]} color="#d9c5a0" />
          <mesh position={[-0.1, -0.05, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color="#fff6e0" roughness={0.4} metalness={0.2} />
          </mesh>

          <mesh position={[-0.1, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 1.8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <spotLight 
            ref={shelfLightRef} 
            position={[-0.1, 0.22, 0]} 
            rotation={[-Math.PI / 2, 0, 0]}
            intensity={0} 
            color="#ffffff" 
            distance={4} 
            angle={Math.PI / 2}
            penumbra={1.0}
          />
        </group>

        {/* Dynamic Overhead Ceiling Spotlight */}
        <pointLight ref={ceilingLightRef} position={[0, 6.8, 2.5]} intensity={0} color="#ffeedd" distance={45} />


        {/* Dynamic Gallery Lights */}
        <pointLight ref={roomLightRef} position={[0, 4, 5]} intensity={1} color="#ffb070" distance={10} castShadow />


        {/* ===================================== */}
        {/* TRANSITION BRIDGE (Z: -5.5)           */}
        {/* ===================================== */}
        <Block position={[-4.5, 3.5, -5.5]} scale={[5, 8, 1]} color="#e8e6e1" />
        <Block position={[4.5, 3.5, -5.5]} scale={[5, 8, 1]} color="#e8e6e1" />

        {/* Museum-grade Architectural Maquette Display in the corner */}
        <ArchitecturalWorkspace position={[4.6, -0.5, -4.0]} scale={1.0} rotation={[0, 0, 0]} />

        {/* ===================================== */}
        {/* INTERIOR CORRIDOR (Z: -5 to -100)     */}
        {/* ===================================== */}
        
        {/* Corridor Floor */}
        <mesh position={[0, -0.5, -52.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[4, 95]} />
          <meshStandardMaterial color="#d4d2cc" roughness={0.4} metalness={0.05} />
        </mesh>
        
        {/* Corridor Left Wall */}
        <Block position={[-2.5, 3.5, -52.5]} scale={[1, 8, 95]} color="#e8e6e1" />
        {/* Corridor Right Wall */}
        <Block position={[2.5, 3.5, -52.5]} scale={[1, 8, 95]} color="#e8e6e1" />
        {/* Corridor Ceiling */}
        <Block position={[0, 7.5, -52.5]} scale={[4, 1, 95]} color="#ffffff" />
        {/* Corridor End Wall */}
        <Block position={[0, 3.5, -100.5]} scale={[4, 8, 1]} color="#e8e6e1" />

        {/* Corridor Lights & Details */}
        {Array.from({ length: 9 }).map((_, i) => (
          <group key={i} position={[0, 0, -10 - i * 10]}>
            <pointLight 
              ref={el => corridorLightsRef.current[i] = el}
              position={[0, 6, 0]} 
              intensity={2.0} 
              color="#ffcca8" 
              distance={15} 
            />
            <Block position={[-1.9, 3.5, 0]} scale={[0.2, 8, 2]} color="#3d2817" />
            <Block position={[1.9, 3.5, 0]} scale={[0.2, 8, 2]} color="#3d2817" />
            <group position={[0, 6.9, 0]}>
              <mesh position={[0, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.04, 0.04, 0.5, 16]} />
                <meshStandardMaterial color="#111111" roughness={0.2} metalness={0.8} />
              </mesh>
              <mesh position={[0, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.035, 0.035, 0.48, 16]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          </group>
        ))}

        {/* ======================================================= */}
        {/* NEW ROOM: MODERN BRIGHT CONTACT PAVILION (X: -15, Z: -12) */}
        {/* ======================================================= */}
        <group position={[-15, 0, -12]}>
          {/* Pavilion Floor - Light Microcement */}
          <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#d4d2cc" roughness={0.4} metalness={0.05} />
          </mesh>

          {/* Open Ceiling / Floating Panel */}
          <Block position={[0, 7.5, 0]} scale={[10, 0.2, 10]} color="#ffffff" />

          {/* Pavilion Walls */}
          {/* Back wall (Off-white / Stucco) */}
          <Block position={[0, 3.5, -4.5]} scale={[10, 8, 0.4]} color="#e8e6e1" />
          {/* Left wall */}
          <Block position={[-4.5, 3.5, 0]} scale={[0.4, 8, 10]} color="#e8e6e1" />
          
          {/* Right architectural slats (Oak / Light Wood) */}
          <group position={[4.5, 3.5, 0]}>
            {Array.from({ length: 8 }).map((_, idx) => (
              <Block key={idx} position={[0, 0, -3.5 + idx * 1.0]} scale={[0.15, 8, 0.3]} color="#d9c5a0" />
            ))}
          </group>

          {/* Monumental Reception Desk */}
          <group position={[0, 0, -1.5]}>
            {/* Desk Base */}
            <Block position={[0, -0.05, 0]} scale={[2.6, 0.9, 0.7]} color="#f5f4f0" />
            
            {/* Top Slab (Marble/Concrete) */}
            <Block position={[0, 0.4, 0]} scale={[2.8, 0.1, 0.8]} color="#e0deda" />

            {/* Modern Glass/Aluminum Laptop (Facing the employee) */}
            <group position={[0.6, 0.46, 0]} rotation={[0, Math.PI - 0.2, 0]}>
              {/* Laptop Base */}
              <RoundedBox args={[0.55, 0.015, 0.38]} position={[0, 0.0075, 0]} radius={0.005} smoothness={4} castShadow receiveShadow>
                <meshStandardMaterial color="#d1d5db" metalness={0.8} roughness={0.2} />
              </RoundedBox>
              
              {/* Keyboard Indentation */}
              <RoundedBox args={[0.45, 0.005, 0.18]} position={[0, 0.015, -0.05]} radius={0.002} smoothness={2}>
                <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.4} />
              </RoundedBox>

              {/* Laptop Screen (Tilted Back towards employee) */}
              <group position={[0, 0.015, -0.18]} rotation={[-0.25, 0, 0]}>
                {/* Screen Shell */}
                <RoundedBox args={[0.55, 0.38, 0.012]} position={[0, 0.19, -0.006]} radius={0.005} smoothness={4} castShadow>
                  <meshStandardMaterial color="#d1d5db" metalness={0.8} roughness={0.2} />
                </RoundedBox>
                {/* Glowing Screen Panel */}
                <mesh position={[0, 0.19, 0.001]}>
                  <planeGeometry args={[0.52, 0.35]} />
                  <meshBasicMaterial color="#eef5ff" />
                </mesh>
                {/* Back Logo (Visible to customer) */}
                <mesh position={[0, 0.19, -0.0125]} rotation={[0, Math.PI, 0]}>
                  <circleGeometry args={[0.03, 32]} />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>
              </group>
            </group>
            
            {/* Elegant Desk Plaque / Sign */}
            <group position={[-0.6, 0.47, 0.1]} rotation={[0, 0.2, 0]} scale={2.2}>
               {/* Plaque Base */}
               <mesh position={[0, 0, 0]} castShadow>
                 <boxGeometry args={[0.3, 0.02, 0.1]} />
                 <meshStandardMaterial color="#d1d5db" metalness={0.8} roughness={0.2} />
               </mesh>
               {/* Angled Face */}
               <mesh position={[0, 0.04, 0.02]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
                 <boxGeometry args={[0.28, 0.08, 0.01]} />
                 <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
               </mesh>
               {/* Text on Plaque */}
               <Text 
                 position={[0, 0.045, 0.026]} 
                 rotation={[-Math.PI / 6, 0, 0]}
                 fontSize={0.018}
                 color="#ffffff"
                 font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
                 letterSpacing={0.15}
               >
                 STUDIO TENET
               </Text>
               <Text 
                 position={[0, 0.025, 0.038]} 
                 rotation={[-Math.PI / 6, 0, 0]}
                 fontSize={0.01}
                 color="#a3a3a3"
                 font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
                 letterSpacing={0.05}
               >
                 INFO@TENET.ES
               </Text>
            </group>
          </group>

          {/* PointLight for guaranteed 360-degree high-fidelity ambient illumination */}
          <pointLight 
            ref={contactLightRef}
            position={[0, 4.0, 1.0]} 
            intensity={0} 
            color="#ffffff" // Clean white gallery light
            distance={15} 
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          {/* Soft ambient fill light to make the room beautifully visible, bright, and premium */}
          <pointLight
            ref={contactFillLightRef}
            position={[0, 3.5, 0]}
            intensity={0}
            color="#fff8f0" // Beautiful warm gallery fill
            distance={15}
            castShadow={false}
          />
        </group>

        {/* ======================================================= */}
        {/* NEW ROOM: 3D ART GALLERY (X: 14 to 58, Z: -6 to 8)      */}
        {/* Arquitectura Premium Blanca                             */}
        {/* ======================================================= */}
        <group position={[32, 0, 0]}>
          {/* Gallery Floor - Suelo microcemento claro */}
          <mesh position={[0, -0.5, 1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[44, 14]} />
            <meshStandardMaterial color="#d4d2cc" roughness={0.4} metalness={0.05} />
          </mesh>

          {/* Foso perimetral inferior (Skirting board hundido) */}
          <Block position={[0, -0.4, -4.9]} scale={[44, 0.2, 0.2]} color="#b0aeaa" castShadow={false} />

          {/* Back Wall (Muro principal de exhibición - Blanco roto) */}
          <Block position={[0, 3.5, -5.0]} scale={[44, 8, 0.8]} color="#e8e6e1" />
          
          {/* Techo flotante blanco */}
          <Block position={[0, 7.5, 1]} scale={[42, 0.5, 12]} color="#f0eee9" />
          
          {/* Lámparas de techo chulas (Track lights cilíndricas negras) */}
          <group position={[0, 7.25, 1]}>
            {/* Carril principal */}
            <Block position={[0, 0, 0]} scale={[40, 0.05, 0.1]} color="#111111" />
            {/* Focos colgantes */}
            {Array.from({ length: 8 }).map((_, idx) => (
              <group key={`lamp-${idx}`} position={[-16 + idx * 4.5, -0.2, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
                  <meshStandardMaterial color="#111111" roughness={0.2} metalness={0.8} />
                </mesh>
                <mesh position={[0, -0.16, 0]}>
                  <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
                  <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2.0} />
                </mesh>
                <spotLight position={[0, -0.2, 0]} intensity={1.5} color="#fffcf5" distance={10} angle={0.8} penumbra={0.5} />
              </group>
            ))}
          </group>

          {/* Front Wall - Columnatas blancas */}
          <group position={[0, 3.5, 7.5]}>
            {Array.from({ length: 10 }).map((_, idx) => (
              <Furniture key={idx} position={[-18 + idx * 4, 0, 0]} scale={[1.2, 8, 1.2]} color="#e8e6e1" radius={0.1} />
            ))}
          </group>

          {/* Pared lateral derecha (Entrada) - Blanco roto */}
          <Block position={[21.5, 3.5, 1]} scale={[1, 8, 14]} color="#e8e6e1" />
          {/* Apertura de la puerta derecha */}
          <Block position={[21.5, 3.5, 6]} scale={[1.2, 6, 4]} color="#d4d2cc" castShadow={false} />

          {/* Bancos eliminados por petición del usuario */}

          {/* Global gallery ambient light */}
          <ambientLight ref={galleryAmbientRef} intensity={0} color="#ffffff" />
          
          <directionalLight 
            ref={galleryDirRef}
            position={[0, 10, 8]} 
            intensity={0} 
            color="#fffcf5" 
            castShadow 
            shadow-bias={-0.0001}
          />
        </group>

        {/* Gallery Projects */}
        {projectsData.map(project => (
          <ProjectCanvas 
            key={project.id} 
            position={project.position} 
            project={project} 
            isActive={activeProject?.id === project.id}
            onSelect={(p) => setActiveProject(p)}
          />
        ))}

      </group>
    </>
  );
}
