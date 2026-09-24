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



function Lights({ progress }) {
  const keyLightRef = useRef();
  const fillLightRef = useRef();
  const rimLightRef = useRef();

  useFrame(() => {
    const p = progress;

    // Key Light (0.15 - 0.30)
    if (keyLightRef.current) {
      const keyIntensity = THREE.MathUtils.mapLinear(p, 0.15, 0.30, 0.2, 1.5);
      keyLightRef.current.intensity = Math.max(0.2, keyIntensity);

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
      const fillIntensity = THREE.MathUtils.mapLinear(p, 0.45, 0.60, 0.1, 0.6);
      fillLightRef.current.intensity = Math.max(0.1, fillIntensity);
    }

    // Rim Light (0.75 - 0.90)
    if (rimLightRef.current) {
      const rimIntensity = THREE.MathUtils.mapLinear(p, 0.75, 0.90, 0.1, 1.2);
      rimLightRef.current.intensity = Math.max(0.1, rimIntensity);
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
        position={[-5, 4, 3]}
        angle={0.6}
        penumbra={0.4}
        intensity={0.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
        color={0xffffff}
      />

      {/* Fill Light */}
      <spotLight
        ref={fillLightRef}
        position={[5, 3, 3]}
        angle={0.8}
        penumbra={0.6}
        intensity={0.1}
        color={0xffffff}
      />

      {/* Rim Light */}
      <spotLight
        ref={rimLightRef}
        position={[0, 2, -5]}
        angle={0.4}
        penumbra={0.4}
        intensity={0.1}
        color={0xffddaa}
      />

      {/* Subtle ambient light */}
      <ambientLight intensity={0.15} />
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
      const startPos = [0, 0.5, 8]; // Further back to see larger model
      const endPos = [0, 0.3, 6];  // Closer at the end

      state.camera.position.x = THREE.MathUtils.lerp(startPos[0], endPos[0], cameraProgress);
      state.camera.position.y = THREE.MathUtils.lerp(startPos[1], endPos[1], cameraProgress);
      state.camera.position.z = THREE.MathUtils.lerp(startPos[2], endPos[2], cameraProgress);
    } else {
      state.camera.position.set(0, 0.5, 8); // Further back initially
    }

    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

function StudioFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#111111" roughness={0.8} metalness={0.2} />
    </mesh>
  );
}

function CanvasContent({ progress, onLoad }) {
  const { scene } = useGLTF('/perfomance/output5.glb');
  const modelRef = useRef();

  useEffect(() => {
    if (scene) {
      console.log('Scene loaded:', scene);

      // Center and normalize the model
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      console.log('Model bounds:', { center, size });

      // Center the model
      scene.position.x = -center.x;
      scene.position.y = -center.y;
      scene.position.z = -center.z;

      // Normalize scale to fit in a reasonable size - make it larger for better visibility
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3 / maxDim; // Increased from 2 to 3 for larger display
      scene.scale.set(scale, scale, scale);

      console.log('Model scale:', scale);

      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.needsUpdate = true;
            // Optimize materials for better lighting
            if (child.material.roughness !== undefined) {
              child.material.roughness = Math.min(child.material.roughness, 0.8);
            }
            if (child.material.metalness !== undefined) {
              child.material.metalness = Math.min(child.material.metalness, 0.9);
            }
          }
        }
      });

      if (onLoad) onLoad();
    }
  }, [scene, onLoad]);

  return (
    <>
      <CameraRig progress={progress} />
      <primitive ref={modelRef} object={scene} position={[0, 0, 0]} />
      <Lights progress={progress} />
      <StudioFloor />
      <Environment preset="studio" background={false} />
      <hemisphereLight args={[0x444444, 0x222222, 0.3]} />
    </>
  );
}

export default function LightingStudio() {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('DARKNESS');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const sectionRef = useRef(null);

  // Check WebGL support on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setIsWebGLSupported(false);
        setError(new Error('WebGL not supported'));
        setIsLoading(false);
      }
    } catch (e) {
      setIsWebGLSupported(false);
      setError(e);
      setIsLoading(false);
    }
  }, []);

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

  const handleLoad = () => {
    console.log('Model loaded successfully');
    setIsLoading(false);
  };

  const handleError = (error) => {
    console.error('Lighting Studio Error:', error);
    setError(error);
    setIsLoading(false);
  };

  return (
    <div ref={sectionRef} className="lighting-studio-container">
      <div className="lighting-studio-header">
        <h1 className="lighting-studio-title">LIGHTING ROOM</h1>
      </div>

      {!isWebGLSupported && (
        <div className="lighting-studio-error">
          <p>3D View Not Available</p>
          <p className="error-message">Your browser doesn't support WebGL. Please try Chrome, Firefox, or Edge.</p>
        </div>
      )}

      {isLoading && isWebGLSupported && (
        <div className="lighting-studio-loading">
          <div className="loading-spinner"></div>
          <p>Loading Studio...</p>
        </div>
      )}

      {error && isWebGLSupported && (
        <div className="lighting-studio-error">
          <p>Failed to load 3D scene</p>
          <p className="error-message">{error?.message || 'Unknown error'}</p>
        </div>
      )}

      {isWebGLSupported && !error && (
        <div className="lighting-studio-canvas">
          <Canvas
            camera={{ position: [0, 0.5, 8], fov: 50 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
              preserveDrawingBuffer: true,
              stencil: false,
              depth: true
            }}
            dpr={Math.min(window.devicePixelRatio, 2)}
            onError={handleError}
            style={{ width: '100%', height: '100%', opacity: isLoading ? 0 : 1 }}
          >
            <Suspense fallback={null}>
              <CanvasContent progress={progress} onLoad={handleLoad} />
            </Suspense>
          </Canvas>
        </div>
      )}

      {showLabels && !isLoading && !error && (
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
