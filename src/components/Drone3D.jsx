import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef, useMemo } from 'react';

// Drone states
const DRONE_STATES = {
  OFF: 'OFF',
  ON: 'ON',
  TURBO: 'TURBO'
};

// Speed configurations
const SPEED_CONFIG = {
  [DRONE_STATES.OFF]: 0,
  [DRONE_STATES.ON]: 0.15,
  [DRONE_STATES.TURBO]: 0.9
};

// Transition speed (0-1, higher = faster transition)
const TRANSITION_SPEED = 0.008;

function DroneModel({ droneState, onLoad }) {
  const { scene } = useGLTF('/perfomance/output3.glb');
  const propellerRefs = useRef({
    prop1: null,
    prop2: null,
    prop3: null,
    prop4: null
  });
  const currentSpeed = useRef(0);
  const targetSpeed = useRef(0);
  const propellerRotations = useRef({
    prop1: 0,
    prop2: 0,
    prop3: 0,
    prop4: 0
  });

  // Update target speed when drone state changes
  useEffect(() => {
    targetSpeed.current = SPEED_CONFIG[droneState];
  }, [droneState]);

  // Find propeller bones, fix materials, and signal load complete
  useEffect(() => {
    function findPropellerBones(object) {
      if (object.isBone) {
        if (object.name === 'prop_1_jnt34') {
          propellerRefs.current.prop1 = object;
        } else if (object.name === 'prop_2_jnt35') {
          propellerRefs.current.prop2 = object;
        } else if (object.name === 'prop_3_jnt36') {
          propellerRefs.current.prop3 = object;
        } else if (object.name === 'prop_4_jnt37') {
          propellerRefs.current.prop4 = object;
        }
      }
      
      if (object.children) {
        object.children.forEach(child => findPropellerBones(child));
      }
    }

    function fixMaterials(object) {
      if (object.isMesh && object.material) {
        // Fix material properties for better color display
        if (Array.isArray(object.material)) {
          object.material.forEach(mat => {
            if (mat) {
              mat.needsUpdate = true;
              // Reduce roughness for better reflections
              if (mat.roughness === 1) {
                mat.roughness = 0.5;
              }
              // Adjust metalness for more realistic appearance
              if (mat.metalness === 1) {
                mat.metalness = 0.8;
              }
            }
          });
        } else {
          object.material.needsUpdate = true;
          // Reduce roughness for better reflections
          if (object.material.roughness === 1) {
            object.material.roughness = 0.5;
          }
          // Adjust metalness for more realistic appearance
          if (object.material.metalness === 1) {
            object.material.metalness = 0.8;
          }
        }
      }
      
      if (object.children) {
        object.children.forEach(child => fixMaterials(child));
      }
    }

    findPropellerBones(scene);
    fixMaterials(scene);

    // Signal that model is loaded
    if (onLoad) onLoad();
  }, [scene, onLoad]);

  // Animate propellers
  useFrame(() => {
    // Smooth speed transition
    const speedDiff = targetSpeed.current - currentSpeed.current;
    if (Math.abs(speedDiff) > 0.001) {
      currentSpeed.current += speedDiff * TRANSITION_SPEED;
    } else {
      currentSpeed.current = targetSpeed.current;
    }

    // Rotate propellers
    if (propellerRefs.current.prop1) {
      propellerRotations.current.prop1 += currentSpeed.current;
      propellerRefs.current.prop1.rotation.y = propellerRotations.current.prop1;
    }
    
    if (propellerRefs.current.prop2) {
      propellerRotations.current.prop2 -= currentSpeed.current; // Opposite direction
      propellerRefs.current.prop2.rotation.y = propellerRotations.current.prop2;
    }
    
    if (propellerRefs.current.prop3) {
      propellerRotations.current.prop3 += currentSpeed.current; // Same as prop1
      propellerRefs.current.prop3.rotation.y = propellerRotations.current.prop3;
    }
    
    if (propellerRefs.current.prop4) {
      propellerRotations.current.prop4 -= currentSpeed.current; // Opposite direction
      propellerRefs.current.prop4.rotation.y = propellerRotations.current.prop4;
    }


  });

  return (
    <primitive 
      object={scene} 
      scale={2}
      position={[0, 0, 0]}
    />
  );
}

function CanvasContent({ droneState, onLoad }) {
  return (
    <>
      <PresentationControls
        global
        zoom={0.8}
        rotation={[0, -Math.PI / 4, 0]}
        polar={[0, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <DroneModel 
          droneState={droneState} 
          onLoad={onLoad}
        />
      </PresentationControls>
      
      <Environment preset="studio" />
      
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.5} 
        castShadow 
      />
      <directionalLight 
        position={[-10, -10, -5]} 
        intensity={0.8} 
      />
      <directionalLight 
        position={[0, 10, 0]} 
        intensity={0.5} 
      />
      
      <ContactShadows 
        position={[0, -1, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2} 
        far={4} 
      />
      
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
      />
    </>
  );
}

function detectWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

export default function Drone3D() {
  const rootRef = useRef(null);
  const [isWebGLSupported] = useState(detectWebGL);
  const [isLoading, setIsLoading] = useState(isWebGLSupported);
  const [error, setError] = useState(null);
  const [droneState, setDroneState] = useState(DRONE_STATES.OFF);
  const [inView, setInView] = useState(true);
  const quality = useMemo(() => {
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    return {
      dpr: Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75),
      antialias: !mobile,
      powerPreference: mobile ? 'default' : 'high-performance',
    };
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '100px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = (error) => {
    console.error('3D Canvas Error:', error);
    setError(error);
    setIsLoading(false);
  };

  return (
    <div className="drone-3d-container" ref={rootRef}>
      {!isWebGLSupported && (
        <div className="drone-error">
          <p>3D View Not Available</p>
          <p className="error-message">Your browser doesn't support WebGL. Please try Chrome, Firefox, or Edge.</p>
        </div>
      )}

      {isLoading && isWebGLSupported && (
        <div className="drone-loading">
          <div className="loading-spinner"></div>
          <p>Loading 3D Model...</p>
        </div>
      )}

      {error && isWebGLSupported && (
        <div className="drone-error">
          <p>Failed to load 3D model</p>
          <p className="error-message">Please try refreshing the page or using a different browser</p>
        </div>
      )}

      {isWebGLSupported && (
        <Canvas
          camera={{ position: [0, 0, 3.5], fov: 50 }}
          frameloop={inView ? 'always' : 'never'}
          gl={{
            antialias: quality.antialias,
            alpha: true,
            powerPreference: quality.powerPreference,
            stencil: false,
            depth: true
          }}
          dpr={quality.dpr}
          onError={handleError}
          style={{ opacity: isLoading ? 0 : 1 }}
        >
        <Suspense fallback={null}>
          <CanvasContent droneState={droneState} onLoad={handleLoad} />
          </Suspense>
        </Canvas>
      )}

      {isWebGLSupported && (
        <div className="drone-3d-overlay">
        <h2 className="drone-3d-title">Aerial unit</h2>
        <p className="drone-3d-subtitle">Four rotors</p>
        <p className="drone-3d-hint">Drag to orbit · Scroll to zoom</p>
        
        <div className="drone-controls">
          <button
            type="button"
            className={`drone-control-btn ${droneState === DRONE_STATES.OFF ? 'active' : ''}`}
            aria-pressed={droneState === DRONE_STATES.OFF}
            onClick={() => setDroneState(DRONE_STATES.OFF)}
          >
            Off
          </button>
          <button
            type="button"
            className={`drone-control-btn ${droneState === DRONE_STATES.ON ? 'active' : ''}`}
            aria-pressed={droneState === DRONE_STATES.ON}
            onClick={() => setDroneState(DRONE_STATES.ON)}
          >
            On
          </button>
          <button
            type="button"
            className={`drone-control-btn ${droneState === DRONE_STATES.TURBO ? 'active' : ''}`}
            aria-pressed={droneState === DRONE_STATES.TURBO}
            onClick={() => setDroneState(DRONE_STATES.TURBO)}
          >
            Turbo
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
