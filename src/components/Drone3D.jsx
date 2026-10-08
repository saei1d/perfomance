import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { supportsWebGL } from '../lib/webgl';
import './drone/drone.css';

const DRONE_URL = `${import.meta.env.BASE_URL}x-webp.glb`;

const DRONE_STATES = {
  OFF: 'OFF',
  ON: 'ON',
  TURBO: 'TURBO',
};

const SPEED_CONFIG = {
  [DRONE_STATES.OFF]: 0,
  [DRONE_STATES.ON]: 9,
  [DRONE_STATES.TURBO]: 54,
};

const PROP_JOINTS = {
  prop_1_jnt34: 'prop1',
  prop_2_jnt35: 'prop2',
  prop_3_jnt36: 'prop3',
  prop_4_jnt37: 'prop4',
};

function DroneModel({ droneState, onLoad }) {
  const { scene } = useGLTF(DRONE_URL);
  const aircraft = useMemo(() => cloneSkeleton(scene), [scene]);
  const group = useRef(null);
  const propellerRefs = useRef({});
  const propellerAngles = useRef({});
  const currentSpeed = useRef(0);
  const targetSpeed = useRef(SPEED_CONFIG[droneState]);
  const yaw = useRef(0.4);

  useEffect(() => {
    targetSpeed.current = SPEED_CONFIG[droneState];
  }, [droneState]);

  useLayoutEffect(() => {
    const joints = {};
    aircraft.traverse((object) => {
      const slot = PROP_JOINTS[object.name];
      if (object.isBone && slot) joints[slot] = object;
      if (object.isMesh && object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          if (material.roughness === 1) material.roughness = 0.42;
          if (material.metalness === 1) material.metalness = 0.72;
          material.needsUpdate = true;
        });
      }
    });
    propellerRefs.current = joints;

    const root = group.current;
    if (!root) return;
    root.scale.setScalar(3);
    root.position.set(0, -0.05, 0);
    root.rotation.set(0.25, yaw.current, 0);
    onLoad?.();
  }, [aircraft, onLoad]);

  useFrame((_, delta) => {
    const dt = Math.min(Math.max(delta, 0), 0.05);
    const speedDiff = targetSpeed.current - currentSpeed.current;
    currentSpeed.current += speedDiff * Math.min(1, dt * 4);

    const spin = currentSpeed.current * dt;
    const joints = propellerRefs.current;
    const directions = { prop1: 1, prop2: -1, prop3: 1, prop4: -1 };
    Object.entries(directions).forEach(([slot, direction]) => {
      const bone = joints[slot];
      if (!bone) return;
      propellerAngles.current[slot] = (propellerAngles.current[slot] || 0) + spin * direction;
      bone.rotation.y = propellerAngles.current[slot];
    });

    yaw.current += dt * 0.16;
    if (group.current) group.current.rotation.y = yaw.current;
  });

  return (
    <group ref={group}>
      <primitive object={aircraft} />
    </group>
  );
}

function Stage() {
  return (
    <>
      <color attach="background" args={['#070708']} />
      <ambientLight intensity={0.45} />
      <spotLight
        position={[1.6, 2.4, 1.8]}
        angle={0.6}
        penumbra={0.75}
        intensity={14}
        color="#fff6e8"
      />
      <spotLight
        position={[-1.8, 1.2, -1.2]}
        angle={0.8}
        penumbra={1}
        intensity={7}
        color="#ffb901"
      />
      <directionalLight position={[-2, 1.4, -2]} intensity={0.8} color="#d5e2f2" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]}>
        <circleGeometry args={[1.15, 48]} />
        <meshBasicMaterial color="#121214" />
      </mesh>
    </>
  );
}

export default function Drone3D() {
  const rootRef = useRef(null);
  const [webgl] = useState(supportsWebGL);
  const [seen, setSeen] = useState(false);
  const [inView, setInView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [droneState, setDroneState] = useState(DRONE_STATES.ON);

  const handleLoad = useCallback(() => setLoading(false), []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || !('IntersectionObserver' in window)) {
      setSeen(true);
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setSeen(true);
      },
      { rootMargin: '180px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="drone-3d-container" ref={rootRef}>
      {!webgl && (
        <div className="drone-error">
          <p>3D view needs WebGL.</p>
          <p className="error-message">Try Chrome, Firefox, or Safari with hardware acceleration on.</p>
        </div>
      )}

      {webgl && seen && (
        <>
          <div className="drone-canvas-wrapper">
            {loading && <p className="drone-status">Loading aircraft</p>}
            <Canvas
              camera={{ position: [0, 0.28, 1.45], fov: 38, near: 0.01, far: 50 }}
              frameloop={inView ? 'always' : 'demand'}
              dpr={[1, 1.5]}
              gl={{
                antialias: true,
                alpha: false,
                stencil: false,
                powerPreference: 'default',
              }}
              onCreated={({ gl, scene }) => {
                gl.toneMappingExposure = 1.05;
                const pmrem = new THREE.PMREMGenerator(gl);
                scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
                pmrem.dispose();
              }}
            >
              <Suspense fallback={null}>
                <Stage />
                <DroneModel droneState={droneState} onLoad={handleLoad} />
              </Suspense>
            </Canvas>
          </div>

          <div className="drone-controls-new" role="group" aria-label="Propeller speed">
            {Object.values(DRONE_STATES).map((state) => (
              <button
                key={state}
                type="button"
                className={`drone-btn-new${droneState === state ? ' active' : ''}`}
                aria-pressed={droneState === state}
                onClick={() => setDroneState(state)}
              >
                {state === DRONE_STATES.OFF ? 'Off' : state === DRONE_STATES.ON ? 'On' : 'Turbo'}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

useGLTF.preload(DRONE_URL);
