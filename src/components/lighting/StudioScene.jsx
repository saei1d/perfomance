import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Suspense, useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { STATUE_URL } from './constants';
import { createTimelineSample, sampleTimeline } from './timeline';

const AIM = new THREE.Vector3(0, 1.05, 0);

function Statue({ onReady }) {
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
    });

    onReady?.();
    invalidate();
  }, [cloned, invalidate, onReady]);

  return (
    <group ref={group}>
      <primitive object={cloned} />
    </group>
  );
}

function applyTimeline(progress, compact, sample, rig) {
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

function StudioRig({ progressRef, compact, modelReady }) {
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
    });
  });

  const shadowSize = compact ? 512 : 1024;

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.02} />

      <spotLight
        ref={keyRef}
        position={[-2.8, 2.35, 3.3]}
        angle={0.42}
        penumbra={0.85}
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
        penumbra={0.95}
        decay={2}
        distance={0}
        intensity={0}
        color="#b7e38a"
      />

      <spotLight
        ref={rimRef}
        position={[-0.35, 2.4, -3.1]}
        angle={0.45}
        penumbra={0.8}
        decay={2}
        distance={0}
        intensity={0}
        color="#fff4e8"
      />

      <object3D ref={aimRef} position={[AIM.x, AIM.y, AIM.z]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[7.5, 64]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.9} metalness={0} />
      </mesh>
    </>
  );
}

export default function StudioScene({ progressRef, compact, onReady }) {
  const modelReady = useRef(false);

  const handleReady = useCallback(() => {
    modelReady.current = true;
    onReady?.();
  }, [onReady]);

  return (
    <>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 9, 16]} />
      <StudioRig progressRef={progressRef} compact={compact} modelReady={modelReady} />
      <Suspense fallback={null}>
        <Statue onReady={handleReady} />
      </Suspense>
    </>
  );
}
