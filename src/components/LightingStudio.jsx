import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';

// Timeline stages configuration
const TIMELINE_STAGES = {
  DARKNESS: { start: 0, end: 0.15 },
  KEY_LIGHT: { start: 0.15, end: 0.30 },
  POSITION: { start: 0.30, end: 0.45 },
  FILL_LIGHT: { start: 0.45, end: 0.60 },
  COLOR: { start: 0.60, end: 0.75 },
  RIM_LIGHT: { start: 0.75, end: 0.90 },
  FINAL: { start: 0.90, end: 1.0 }
};

function StatueModel({ progress }) {
  const { scene } = useGLTF('/output5.glb');
  const modelRef = useRef();

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          // Optimize materials
          if (child.material) {
            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [scene]);

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={1.5}
      position={[0, 0, 0]}
      rotation={[0, Math.PI, 0]}
    />
  );
}

function Lights({ progress }) {
  const keyLightRef = useRef();
  const fillLightRef = useRef();
  const rimLightRef = useRef();

  useFrame(() => {
    const p = progress;

    // Key Light (0.15 - 0.30)
    if (keyLightRef.current) {
      const keyIntensity = THREE.MathUtils.mapLinear(p, 0.15, 0.30, 0, 1.5);
      keyLightRef.current.intensity = Math.max(0, keyIntensity);

      // Key Light Position (0.30 - 0.45)
      if (p >= 0.30 && p <= 0.45) {
        const angle = THREE.MathUtils.mapLinear(p, 0.30, 0.45, -Math.PI / 4, Math.PI / 4);
        const radius = 5;
        keyLightRef.current.position.x = Math.sin(angle) * radius;
        keyLightRef.current.position.z = Math.cos(angle) * radius - 3;
      }
    }

    // Fill Light (0.45 - 0.60)
    if (fillLightRef.current) {
      const fillIntensity = THREE.MathUtils.mapLinear(p, 0.45, 0.60, 0, 0.6);
      fillLightRef.current.intensity = Math.max(0, fillIntensity);
    }

    // Rim Light (0.75 - 0.90)
    if (rimLightRef.current) {
      const rimIntensity = THREE.MathUtils.mapLinear(p, 0.75, 0.90, 0, 1.2);
      rimLightRef.current.intensity = Math.max(0, rimIntensity);
    }

    // Color change (0.60 - 0.75)
    if (keyLightRef.current && p >= 0.60 && p <= 0.75) {
      const colorProgress = THREE.MathUtils.mapLinear(p, 0.60, 0.75, 0, 1);
      const warmColor = new THREE.Color(0xffffff);
      const cinematicColor = new THREE.Color(0xffeedd);
      keyLightRef.current.color.lerpColors(warmColor, cinematicColor, colorProgress);
    }
  });

  return (
    <>
      {/* Key Light */}
      <spotLight
        ref={keyLightRef}
        position={[-4, 3, 2]}
        angle={0.5}
        penumbra={0.5}
        intensity={0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        color={0xffffff}
      />

      {/* Fill Light */}
      <spotLight
        ref={fillLightRef}
        position={[4, 2, 2]}
        angle={0.6}
        penumbra={0.8}
        intensity={0}
        color={0xffffff}
      />

      {/* Rim Light */}
      <spotLight
        ref={rimLightRef}
        position={[0, 1, -4]}
        angle={0.3}
        penumbra={0.3}
        intensity={0}
        color={0xffddaa}
      />

      {/* Very subtle ambient light */}
      <ambientLight intensity={0.05} />
    </>
  );
}

function CameraRig({ progress }) {
  const cameraRef = useRef();

  useFrame((state) => {
    const p = progress;

    // Camera movement (0.90 - 1.0)
    if (p >= 0.90) {
      const cameraProgress = THREE.MathUtils.mapLinear(p, 0.90, 1.0, 0, 1);
      const startPos = [0, 0, 5];
      const endPos = [0, 0.2, 4];

      state.camera.position.x = THREE.MathUtils.lerp(startPos[0], endPos[0], cameraProgress);
      state.camera.position.y = THREE.MathUtils.lerp(startPos[1], endPos[1], cameraProgress);
      state.camera.position.z = THREE.MathUtils.lerp(startPos[2], endPos[2], cameraProgress);
    } else {
      state.camera.position.set(0, 0, 5);
    }

    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

function StudioFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <shadowMaterial opacity={0.3} />
    </mesh>
  );
}

function CanvasContent({ progress }) {
  return (
    <>
      <CameraRig progress={progress} />
      <StatueModel progress={progress} />
      <Lights progress={progress} />
      <StudioFloor />
      <Environment preset="studio" background={false} />
    </>
  );
}

export default function LightingStudio() {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('DARKNESS');
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;

      // Calculate progress when section is in view
      const scrollTop = -rect.top;
      const maxScroll = sectionHeight - windowHeight;

      if (scrollTop >= 0 && scrollTop <= maxScroll) {
        const p = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
        setProgress(p);

        // Determine current stage
        for (const [stageName, range] of Object.entries(TIMELINE_STAGES)) {
          if (p >= range.start && p < range.end) {
            setCurrentStage(stageName);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stageLabels = {
    DARKNESS: { number: '01', title: 'DARKNESS', subtitle: '' },
    KEY_LIGHT: { number: '02', title: 'KEY LIGHT', subtitle: 'Shape the subject.' },
    POSITION: { number: '03', title: 'POSITION', subtitle: 'Change the mood.' },
    FILL_LIGHT: { number: '04', title: 'FILL LIGHT', subtitle: 'Control the shadows.' },
    COLOR: { number: '05', title: 'COLOR', subtitle: 'Set the tone.' },
    RIM_LIGHT: { number: '06', title: 'RIM LIGHT', subtitle: 'Separate the subject.' },
    FINAL: { number: '', title: 'FROM LIGHT', subtitle: 'TO STORY' }
  };

  const currentLabel = stageLabels[currentStage] || stageLabels.DARKNESS;
  const showLabels = progress < 0.90;

  return (
    <div ref={sectionRef} className="lighting-studio-container">
      <div className="lighting-studio-canvas">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true,
            stencil: false,
            depth: true
          }}
          dpr={Math.min(window.devicePixelRatio, 2)}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <CanvasContent progress={progress} />
          </Suspense>
        </Canvas>
      </div>

      {showLabels && (
        <div className="lighting-studio-overlay">
          <div className="lighting-studio-labels">
            <span className="stage-number">{currentLabel.number}</span>
            <h2 className="stage-title">{currentLabel.title}</h2>
            {currentLabel.subtitle && (
              <p className="stage-subtitle">{currentLabel.subtitle}</p>
            )}
          </div>
        </div>
      )}

      <div className="lighting-studio-progress">
        <div
          className="progress-bar"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
