// src/components/VisualRoom/EnhancedGround.jsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Enhanced ground with texture and better visual appeal
 */
const EnhancedGround = ({ rows, cols }) => {
  const groundRef = useRef();
  const gridSize = Math.max(rows, cols) * 2.8;
  const floorSize = gridSize + 4; // Extra border

  return (
    <group>
      {/* Main Floor */}
      <mesh 
        ref={groundRef} 
        receiveShadow 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.1, 0]}
      >
        <planeGeometry args={[floorSize, floorSize, 32, 32]} />
        <meshStandardMaterial 
          color="#f8fafc"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Floor Border */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.09, 0]}
        receiveShadow
      >
        <ringGeometry args={[floorSize - 0.2, floorSize, 64]} />
        <meshStandardMaterial 
          color="#e2e8f0"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Enhanced Grid Pattern */}
      <GridPattern rows={rows} cols={cols} />
    </group>
  );
};

/**
 * Grid pattern that matches bench positions
 */
const GridPattern = ({ rows, cols }) => {
  const cellSize = 2.5;
  const gridWidth = cols * cellSize;
  const gridHeight = rows * cellSize;

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      {/* Vertical lines */}
      {Array.from({ length: cols + 1 }).map((_, i) => (
        <mesh key={`v-${i}`} position={[i * cellSize - gridWidth / 2, 0, 0]}>
          <boxGeometry args={[0.02, gridHeight, 0.02]} />
          <meshStandardMaterial color="#cbd5e1" transparent opacity={0.4} />
        </mesh>
      ))}
      
      {/* Horizontal lines */}
      {Array.from({ length: rows + 1 }).map((_, i) => (
        <mesh key={`h-${i}`} position={[0, i * cellSize - gridHeight / 2, 0]}>
          <boxGeometry args={[gridWidth, 0.02, 0.02]} />
          <meshStandardMaterial color="#cbd5e1" transparent opacity={0.4} />
        </mesh>
      ))}

      {/* Grid cell indicators */}
      {Array.from({ length: rows }).map((_, row) => 
        Array.from({ length: cols }).map((_, col) => (
          <mesh 
            key={`cell-${row}-${col}`} 
            position={[
              col * cellSize - gridWidth / 2 + cellSize / 2,
              row * cellSize - gridHeight / 2 + cellSize / 2,
              0
            ]}
          >
            <planeGeometry args={[cellSize - 0.2, cellSize - 0.2]} />
            <meshStandardMaterial 
              color="#94a3b8" 
              transparent 
              opacity={0.1}
              wireframe={false}
            />
          </mesh>
        ))
      )}

      {/* Corner markers */}
      <mesh position={[-gridWidth/2, -gridHeight/2, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.05]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      <mesh position={[gridWidth/2, -gridHeight/2, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.05]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      <mesh position={[-gridWidth/2, gridHeight/2, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.05]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      <mesh position={[gridWidth/2, gridHeight/2, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.05]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
    </group>
  );
};

export default EnhancedGround;