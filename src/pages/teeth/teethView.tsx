import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import TeethModel from './teethmodel';

export default function TeethViewer() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 50 }}
      style={{ background: '#f0f0f0' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <TeethModel />
      <OrbitControls />
    </Canvas>
  );
}