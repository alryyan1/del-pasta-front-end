import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Tooth } from './tooth';

export default function TeethModel() {
  const ref = useRef();
  
  // Define teeth positions for upper and lower jaw
  const teethPositions = {
    upper: [
      [-3, 2, 0], [-2, 2, 0], [-1, 2, 0], [0, 2, 0], [1, 2, 0], [2, 2, 0], [3, 2, 0], [4, 2, 0],
      [-3, 1, 0], [-2, 1, 0], [-1, 1, 0], [0, 1, 0], [1, 1, 0], [2, 1, 0], [3, 1, 0], [4, 1, 0]
    ],
    lower: [
      [-3, -1, 0], [-2, -1, 0], [-1, -1, 0], [0, -1, 0], [1, -1, 0], [2, -1, 0], [3, -1, 0], [4, -1, 0],
      [-3, -2, 0], [-2, -2, 0], [-1, -2, 0], [0, -2, 0], [1, -2, 0], [2, -2, 0], [3, -2, 0], [4, -2, 0]
    ]
  };

  return (
    <group ref={ref}>
      {/* Upper teeth */}
      {teethPositions.upper.map((position, index) => (
        <Tooth 
          key={`upper-${index}`}
          position={position}
          toothNumber={index + 1}
        />
      ))}
      
      {/* Lower teeth */}
      {teethPositions.lower.map((position, index) => (
        <Tooth
          key={`lower-${index}`}
          position={position}
          toothNumber={index + 17}
        />
      ))}
    </group>
  );
}