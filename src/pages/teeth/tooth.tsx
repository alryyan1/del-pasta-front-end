import { useState } from 'react';
import * as THREE from 'three';
import { useStore } from './store';

export function Tooth({ position, toothNumber }) {
  const [hovered, setHovered] = useState(false);
  const { selectedTooth, selectTooth, toothConditions } = useStore();
  
  const isSelected = selectedTooth === toothNumber;
  const condition = toothConditions[toothNumber];

  const getToothColor = () => {
    if (isSelected) return 'yellow';
    if (condition?.needsCleaning) return 'brown';
    if (condition?.needsFilling) return 'red';
    if (condition?.needsExtraction) return 'purple';
    return 'white';
  };

  return (
    <mesh
      position={position}
      onClick={() => selectTooth(toothNumber)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[0.8, 1, 0.8]} />
      <meshStandardMaterial 
        color={getToothColor()}
        emissive={hovered ? 'gray' : 'black'}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}