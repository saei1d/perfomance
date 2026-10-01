import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { STATUE_URL } from './constants';
import { createTimelineSample, sampleTimeline } from './timeline';

const AIM = new THREE.Vector3(0, 1.05, 0);

function Statue({ onReady }) {
  const { scene } = useGLTF(STATUE_URL, false, false);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const group = useRef(null);

  useLayoutEffect(() => {
    const root = group.current;
    if (!root) return;

    root.scale.set(1, 1, 1);
    root.position.set(0, 0, 0);
    root.rotation.y = Math.PI * 1.27; // Rotate 225 degrees
    root.updateWorldMatrix(true, true);

    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    root.scale.setScalar(2.2 / maxDim);
    root.updateWorldMatrix(true, true);

    const fitted = new THREE.Box3().setFromObject(root);
    const center = fitted.getCenter(new THREE.Vector3());
    root.position.set(-center.x, -fitted.min.y + 0.002, -center.z);

    root.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      child.frustumCulled = true;
    });

    onReady?.();
  }, [cloned, onReady]);

  return (
    <group ref={group}>
      <primitive object={cloned} />
    </group>
  );
}

function StudioRig({ progressRef, compact }) {
  const keyRef = useRef(null);
  const fillRef = useRef(null);
  const rimRef = useRef(null);
  const aimRef = useRef(null);
  const ambientRef = useRef(null);
  const sample = useMemo(() => createTimelineSample(), []);
  const keyColor = useMemo(() => new THREE.Color(), []);
  const cameraTarget = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  const currentLook = useMemo(() => new THREE.Vector3(0, 0.95, 0), []);

  useLayoutEffect(() => {
    const aim = aimRef.current;
    if (!aim) return;
    [keyRef, fillRef, rimRef].forEach((lightRef) => {
      if (lightRef.current) lightRef.current.target = aim;
    });
  }, []);

  useFrame((state, delta) => {
    const aim = aimRef.current;
    if (aim) aim.updateMatrixWorld();

    sampleTimeline(progressRef.current, compact, sample);
    const damp = 1 - Math.exp(-delta * 7.5);

    const key = keyRef.current;
    if (key) {
      key.intensity = THREE.MathUtils.lerp(key.intensity, sample.keyIntensity, damp);
      key.position.x = THREE.MathUtils.lerp(key.position.x, sample.keyPosition.x, damp);
      key.position.y = THREE.MathUtils.lerp(key.position.y, sample.keyPosition.y, damp);
      key.position.z = THREE.MathUtils.lerp(key.position.z, sample.keyPosition.z, damp);
      keyColor.setRGB(sample.keyColor.r, sample.keyColor.g, sample.keyColor.b);
      key.color.lerp(keyColor, damp);
    }

    if (fillRef.current) {
      fillRef.current.intensity = THREE.MathUtils.lerp(
        fillRef.current.intensity,
        sample.fillIntensity,
        damp,
      );
    }

    if (rimRef.current) {
      rimRef.current.intensity = THREE.MathUtils.lerp(
        rimRef.current.intensity,
        sample.rimIntensity,
        damp,
      );
    }

    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        sample.ambient,
        damp,
      );
    }

    cameraTarget.set(sample.camera.x, sample.camera.y, sample.camera.z);
    lookTarget.set(sample.look.x, sample.look.y, sample.look.z);
    currentLook.lerp(lookTarget, damp);
    state.camera.position.lerp(cameraTarget, damp);
    state.camera.lookAt(currentLook);
  });

  const shadowSize = compact ? 512 : 1024;

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.02} />

      <spotLight
        ref={keyRef}
        position={[-2.8, 2.35, 3.3]}
        angle={0.46}
        penumbra={0.78}
        decay={2}
        distance={0}
        intensity={5}
        color="#f7f3e8"
        castShadow
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
        shadow-bias={-0.00025}
        shadow-normalBias={0.035}
        shadow-camera-near={0.4}
        shadow-camera-far={16}
      />

      <spotLight
        ref={fillRef}
        position={[3.1, 1.7, 2.5]}
        angle={0.72}
        penumbra={0.9}
        decay={2}
        distance={0}
        intensity={0}
        color="#00ff00"
      />

      <spotLight
        ref={rimRef}
        position={[-0.35, 2.4, -3.1]}
        angle={0.5}
        penumbra={0.7}
        decay={2}
        distance={0}
        intensity={0}
        color="#fff4e8"
      />

      <object3D ref={aimRef} position={[AIM.x, AIM.y, AIM.z]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.82} metalness={0.04} />
      </mesh>
    </>
  );
}

function FinalEffect({ progressRef }) {
  const groupRef = useRef(null);
  const particlesRef = useRef(null);
  
  const particles = useMemo(() => {
    const count = 80;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = 2 + Math.random() * 2;
      
      // Green and gold colors
      const isGreen = Math.random() > 0.3;
      colors[i * 3] = isGreen ? 0 : 1;
      colors[i * 3 + 1] = isGreen ? 1 : 0.8;
      colors[i * 3 + 2] = isGreen ? 0 : 0;
    }
    
    return { positions, count, colors };
  }, []);
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Show during final stage (0.6 to 0.75)
    const progress = (progressRef.current - 0.6) / 0.15;
    if (progress <= 0) {
      groupRef.current.visible = false;
      return;
    }

    groupRef.current.visible = true;

    const easedProgress = Math.min(1, progress * 1.5);
    
    // Particle animation
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particles.count; i++) {
        positions[i * 3] += (Math.random() - 0.5) * 0.02;
        positions[i * 3 + 1] += (Math.random() - 0.5) * 0.02;
        positions[i * 3 + 2] += Math.random() * 0.03;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.material.opacity = easedProgress * 0.7;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Decorative particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.count}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.count}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          transparent
          opacity={0}
          vertexColors
          sizeAttenuation
          depthTest={false}
        />
      </points>
    </group>
  );
}

export default function StudioScene({ progressRef, compact, onReady }) {
  return (
    <>
      <color attach="background" args={['#050505']} />
      <StudioRig progressRef={progressRef} compact={compact} />
      <Suspense fallback={null}>
        <Statue onReady={onReady} />
      </Suspense>
      <FinalEffect progressRef={progressRef} />
    </>
  );
}