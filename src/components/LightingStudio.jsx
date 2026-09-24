import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// Fallback component if model fails to load
function FallbackStatue() {
  return (
    <mesh>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="#888888" />
    </mesh>
  );
}

function SimpleStatue({ onLoad }) {
  const { scene } = useGLTF('/perfomance/output5.glb');
  const modelRef = useRef();

  useEffect(() => {
    if (scene) {
      console.log('Scene loaded successfully, children:', scene.children.length);

      // Center and normalize the model
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      console.log('Model bounds:', { center, size });

      // Center the model manually
      scene.position.set(0, 0.5, 0); // Adjust Y position for centering

      // Normalize scale to fit in a reasonable size
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.8 / maxDim; // Smaller scale
      scene.scale.set(scale, scale, scale);

      console.log('Model scale:', scale);

      scene.traverse((child) => {
        if (child.isMesh) {
          console.log('Found mesh:', child.name);
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.needsUpdate = true;
            // Force materials to be visible
            if (child.material.color) {
              child.material.color.setHex(0xffffff);
            }
            if (child.material.roughness !== undefined) {
              child.material.roughness = 0.3;
            }
            if (child.material.metalness !== undefined) {
              child.material.metalness = 0.1;
            }
          }
        }
      });

      if (onLoad) onLoad();
    }
  }, [scene, onLoad]);

  return (
    <>
      <primitive ref={modelRef} object={scene} position={[0, 0, 0]} />
      <Environment preset="studio" background={false} />
      <ambientLight intensity={5.0} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={10} color="#ffffff" castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={5} color="#ffffff" />
      <pointLight position={[0, 3, 2]} intensity={5} color="#ffffff" />
    </>
  );
}

export default function LightingStudio() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);

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
    <div className="lighting-studio-container" style={{ background: '#1a1a1a' }}>
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
            camera={{ position: [0, 0, 5], fov: 50 }}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: "high-performance"
            }}
            dpr={Math.min(window.devicePixelRatio, 2)}
            onError={handleError}
            style={{ width: '100%', height: '100%', background: '#2a2a2a' }}
          >
            <color attach="background" args={['#2a2a2a']} />
            <Suspense fallback={<FallbackStatue />}>
              <SimpleStatue onLoad={handleLoad} />
            </Suspense>
          </Canvas>
        </div>
      )}
    </div>
  );
}
