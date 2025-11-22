// src/components/VisualRoom/BenchPlaceholder.jsx
import React from 'react';

/**
 * Fallback bench component when GLB models are not available
 */
const BenchPlaceholder = ({ bench, rows, cols, onRemove }) => {
  const spacing = 2.8;
  const x = (bench.col - (cols - 1) / 2) * spacing;
  const z = (bench.row - (rows - 1) / 2) * spacing;

  return (
    <group position={[x, 0, z]}>
      {/* Bench placeholder */}
      <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[2, 0.3, 0.8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Legs */}
      <mesh castShadow receiveShadow position={[-0.8, 0.15, 0]}>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh castShadow receiveShadow position={[0.8, 0.15, 0]}>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      
      {/* Chairs */}
      <ChairsPlaceholder capacity={bench.capacity} />
    </group>
  );
};

/**
 * Placeholder chairs
 */
const ChairsPlaceholder = ({ capacity }) => {
  const chairPositions = getChairPositions(capacity);
  
  return (
    <group>
      {chairPositions.map((position, index) => (
        <mesh key={index} castShadow receiveShadow position={position}>
          <boxGeometry args={[0.6, 0.8, 0.6]} />
          <meshStandardMaterial color="#4A90E2" />
        </mesh>
      ))}
    </group>
  );
};

export default BenchPlaceholder;