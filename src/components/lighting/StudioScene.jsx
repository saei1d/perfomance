import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Suspense, useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { STATUE_URL } from './constants';
import { createTimelineSample, sampleTimeline } from './timeline';

const AIM = new THREE.Vector3(0, 1.05, 0);

function Statue({ onReady, mousePosition }) {
  const { scene } = useGLTF(STATUE_URL, false, false);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const group = useRef(null);
  const invalidate = useThree((state) => state.invalidate);

  useLayoutEffect(() => {
    const root = group.current;
    if (!root) return;

    root.scale.set(1, 1, 1);
    root.position.set(0, 0, 0);
    root.rotation.y = Math.PI * 1.27;
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
      
      // Enhance material for better light absorption
      if (child.material) {
        child.material.roughness = Math.min(0.5, child.material.roughness || 0.5);
        child.material.metalness = Math.max(0.3, child.material.metalness || 0.3);
        child.material.envMapIntensity = 1.0;
      }
    });

    onReady?.();
    invalidate();
  }, [cloned, invalidate, onReady]);

  // Interactive rotation based on mouse position
  useFrame(() => {
    if (group.current && mousePosition) {
      const targetRotation = Math.PI * 1.27 + mousePosition.x * 0.3;
      group.current.rotation.y += (targetRotation - group.current.rotation.y) * 0.05;
    }
  });

  return (
    <group ref={group}>
      <primitive object={cloned} />
    </group>
  );
}

function applyTimeline(progress, compact, sample, rig, manualControls = null) {
  if (manualControls) {
    // Use manual controls instead of timeline
    const key = rig.key.current;
    if (key) {
      key.intensity = manualControls.keyIntensity;
      key.position.set(
        manualControls.keyPosition.x,
        manualControls.keyPosition.y,
        manualControls.keyPosition.z
      );
      rig.keyColor.setRGB(
        manualControls.keyColor.r,
        manualControls.keyColor.g,
        manualControls.keyColor.b
      );
      key.color.copy(rig.keyColor);
    }

    if (rig.fill.current) rig.fill.current.intensity = manualControls.fillIntensity;
    if (rig.rim.current) rig.rim.current.intensity = manualControls.rimIntensity;
    if (rig.ambient.current) rig.ambient.current.intensity = manualControls.ambient;

    // Keep camera from timeline for positioning
    sampleTimeline(progress, compact, sample);
    const camera = rig.camera;
    camera.position.set(sample.camera.x, sample.camera.y, sample.camera.z);
    camera.lookAt(sample.look.x, sample.look.y, sample.look.z);
  } else {
    // Use timeline-based animation
    sampleTimeline(progress, compact, sample);

    const key = rig.key.current;
    if (key) {
      key.intensity = sample.keyIntensity;
      key.position.set(sample.keyPosition.x, sample.keyPosition.y, sample.keyPosition.z);
      rig.keyColor.setRGB(sample.keyColor.r, sample.keyColor.g, sample.keyColor.b);
      key.color.copy(rig.keyColor);
    }

    if (rig.fill.current) rig.fill.current.intensity = sample.fillIntensity;
    if (rig.rim.current) rig.rim.current.intensity = sample.rimIntensity;
    if (rig.ambient.current) rig.ambient.current.intensity = sample.ambient;

    const camera = rig.camera;
    camera.position.set(sample.camera.x, sample.camera.y, sample.camera.z);
    camera.lookAt(sample.look.x, sample.look.y, sample.look.z);
  }
}

function StudioRig({ progressRef, compact, modelReady, manualControls, mousePosition }) {
  const keyRef = useRef(null);
  const fillRef = useRef(null);
  const rimRef = useRef(null);
  const aimRef = useRef(null);
  const ambientRef = useRef(null);
  const sample = useMemo(() => createTimelineSample(), []);
  const keyColor = useMemo(() => new THREE.Color(), []);
  const camera = useThree((state) => state.camera);

  useLayoutEffect(() => {
    const aim = aimRef.current;
    if (!aim) return;
    [keyRef, fillRef, rimRef].forEach((lightRef) => {
      if (lightRef.current) lightRef.current.target = aim;
    });
  }, []);

  useFrame(() => {
    const aim = aimRef.current;
    if (aim) aim.updateMatrixWorld();

    const progress = modelReady.current ? progressRef.current : 0;
    applyTimeline(progress, compact, sample, {
      key: keyRef,
      fill: fillRef,
      rim: rimRef,
      ambient: ambientRef,
      keyColor,
      camera,
    }, manualControls);

    // Interactive mouse feedback on key light position in manual mode
    if (manualControls && keyRef.current && mousePosition) {
      const key = keyRef.current;
      const baseX = manualControls.keyPosition.x;
      const baseZ = manualControls.keyPosition.z;
      
      // Subtle mouse-based light movement
      key.position.x = baseX + mousePosition.x * 0.3;
      key.position.z = baseZ + mousePosition.y * 0.2;
    }
  });

  const shadowSize = compact ? 1024 : 2048;

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.02} />

      <spotLight
        ref={keyRef}
        position={[-2.8, 2.35, 3.3]}
        angle={0.38}
        penumbra={0.75}
        decay={2}
        distance={0}
        intensity={5}
        color="#39ff14"
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
        penumbra={0.95}
        decay={2}
        distance={0}
        intensity={0}
        color="#ffffff"
      />

      <spotLight
        ref={rimRef}
        position={[-0.35, 2.4, -3.1]}
        angle={0.45}
        penumbra={0.8}
        decay={2}
        distance={0}
        intensity={0}
        color="#39ff14"
      />

      <pointLight
        position={[2, 1, 2]}
        intensity={0.5}
        color="#39ff14"
        distance={10}
        decay={2}
      />

      <pointLight
        position={[-2, 1.5, -2]}
        intensity={0.8}
        color="#ffffff"
        distance={10}
        decay={2}
      />

      <object3D ref={aimRef} position={[AIM.x, AIM.y, AIM.z]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[7.5, 64]} />
        <meshStandardMaterial 
          color="#050505" 
          roughness={0.6} 
          metalness={0.3}
          envMapIntensity={0.8}
        />
      </mesh>
    </>
  );
}

export default function StudioScene({ progressRef, compact, onReady, mousePosition, manualControls }) {
  const modelReady = useRef(false);

  const handleReady = useCallback(() => {
    modelReady.current = true;
    onReady?.();
  }, [onReady]);

  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 8, 18]} />
      <StudioRig progressRef={progressRef} compact={compact} modelReady={modelReady} manualControls={manualControls} mousePosition={mousePosition} />
      <Suspense fallback={null}>
        <Statue onReady={handleReady} mousePosition={mousePosition} />
      </Suspense>
    </>
  );
}
