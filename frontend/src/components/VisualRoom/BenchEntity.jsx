// src/components/VisualRoom/BenchEntity.jsx
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { useModelLoader } from '../../hooks/useModelLoader';

/**
 * Enhanced bench entity with 3D chair models
 */
const BenchEntity = ({ bench, rows, cols, onRemove }) => {
  const groupRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Load chair model
  const { model: chairModel, loading: chairLoading, error: chairError } = 
    useModelLoader('/assets/chair.glb');

  // Calculate bench scale based on capacity
  const benchScale = getBenchScale(bench.capacity);
  
  // Calculate position in grid
  const spacing = 2.5;
  const x = (bench.col - (cols - 1) / 2) * spacing;
  const z = (bench.row - (rows - 1) / 2) * spacing;

  // Memoized chair positions
  const chairPositions = useMemo(() => 
    getChairPositions(bench.capacity, benchScale), 
    [bench.capacity, benchScale]
  );

  // Entrance animation
  useEffect(() => {
    if (groupRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo(groupRef.current.scale, 
        { x: 0, y: 0, z: 0 },
        { 
          x: 1, y: 1, z: 1, 
          duration: 0.8, 
          ease: "elastic.out(1.2, 0.5)" 
        }
      );
      
      return () => {
        tl.kill();
      };
    }
  }, []);

  // Hover animation
  useFrame(() => {
    if (groupRef.current && isHovered) {
      groupRef.current.position.y = 0.1 + Math.sin(Date.now() * 0.005) * 0.05;
    } else if (groupRef.current) {
      groupRef.current.position.y = 0;
    }
  });

  const handleRemove = () => {
    if (groupRef.current) {
      const tl = gsap.timeline();
      
      tl.to(groupRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.4,
        ease: "power2.in"
      });
      
      tl.to(groupRef.current.rotation, {
        y: Math.PI,
        duration: 0.4,
        ease: "power2.in",
        onComplete: onRemove
      }, "-=0.4");
    } else {
      onRemove();
    }
  };

  return (
    <group 
      ref={groupRef}
      position={[x, 0, z]}
      onPointerEnter={() => {
        setIsHovered(true);
        setShowControls(true);
      }}
      onPointerLeave={() => {
        setIsHovered(false);
        setTimeout(() => setShowControls(false), 1000);
      }}
    >
      {/* Bench Structure */}
      <BenchStructure scale={benchScale} isHovered={isHovered} />
      
      {/* 3D Chairs or Fallback */}
      <Chairs 
        capacity={bench.capacity}
        benchScale={benchScale}
        isHovered={isHovered}
        chairModel={chairModel}
        chairLoading={chairLoading}
        chairError={chairError}
        positions={chairPositions}
      />
      
      {/* Interactive Controls */}
      {showControls && (
        <Html center distanceFactor={8}>
          <div className="bg-black/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl shadow-2xl border border-white/20 transform -translate-y-20">
            <div className="text-center mb-2">
              <div className="text-sm font-semibold">Bench {bench.id}</div>
              <div className="text-xs text-gray-300">{bench.capacity} seats</div>
            </div>
            <button
              onClick={handleRemove}
              className="flex items-center space-x-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm"
            >
              <span>🗑️ Remove</span>
            </button>
          </div>
        </Html>
      )}

      {/* Selection Highlight */}
      {isHovered && (
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.4, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
};

/**
 * Bench structure component
 */
const BenchStructure = React.memo(({ scale, isHovered }) => {
  return (
    <group>
      {/* Bench Top */}
      <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[scale.width, 0.1, scale.depth]} />
        <meshStandardMaterial 
          color={isHovered ? "#a16207" : "#8B4513"} 
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Bench Legs */}
      <mesh castShadow receiveShadow position={[-scale.width/2 + 0.2, 0.15, 0]}>
        <boxGeometry args={[0.15, 0.3, 0.15]} />
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </mesh>
      <mesh castShadow receiveShadow position={[scale.width/2 - 0.2, 0.15, 0]}>
        <boxGeometry args={[0.15, 0.3, 0.15]} />
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </mesh>
    </group>
  );
});

/**
 * Chairs component with 3D models or fallback
 */
const Chairs = React.memo(({ 
  capacity, benchScale, isHovered, chairModel, chairLoading, chairError, positions 
}) => {
  // Use 3D chair model if available, otherwise use fallback boxes
  const use3DChairs = chairModel && !chairLoading && !chairError;

  return (
    <group>
      {positions.map((position, index) => (
        <group key={index} position={position}>
          {use3DChairs ? (
            <Chair3D model={chairModel} isHovered={isHovered} />
          ) : (
            <ChairFallback isHovered={isHovered} />
          )}
        </group>
      ))}
    </group>
  );
});

/**
 * 3D Chair component using the loaded model
 */
const Chair3D = React.memo(({ model, isHovered }) => {
  const chairRef = useRef();

  // Clone the model to avoid mutating the original
  const clonedModel = useMemo(() => {
    if (model) {
      const clone = model.clone();
      // Scale and position the chair appropriately
      clone.scale.set(0.002, 0.002, 0.002);
      clone.rotation.y = Math.PI; // Face away from bench
      clone.position.y = 0.02;
      return clone;
    }
    return null;
  }, [model]);

  // Add hover effect to 3D chairs
  useFrame(() => {
    if (chairRef.current && isHovered) {
      chairRef.current.rotation.y = Math.PI + Math.sin(Date.now() * 0.01) * 0.1;
    } else if (chairRef.current) {
      chairRef.current.rotation.y = Math.PI;
    }
  });

  if (!clonedModel) return null;

  return (
    <primitive
      ref={chairRef}
      object={clonedModel}
      castShadow
      receiveShadow
    />
  );
});

/**
 * Fallback chair (blue box) when 3D model is not available
 */
const ChairFallback = React.memo(({ isHovered }) => {
  return (
    <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
      <boxGeometry args={[0.5, 0.8, 0.5]} />
      <meshStandardMaterial 
        color={isHovered ? "#2563eb" : "#4A90E2"} 
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
});

/**
 * Calculate bench scale based on capacity
 */
const getBenchScale = (capacity) => {
  const baseScale = { width: 1.2, height: 1, depth: 0.6 };
  
  // Scale width based on capacity
  const widthScale = 0.8 + (capacity - 1) * 0.4;
  
  return {
    width: baseScale.width * widthScale,
    height: baseScale.height,
    depth: baseScale.depth
  };
};

/**
 * Calculate chair positions based on capacity and bench scale
 */
const getChairPositions = (capacity, benchScale) => {
  const positions = [];
  const benchWidth = benchScale.width;
  
  switch (capacity) {
    case 1:
      positions.push([0, 0, benchScale.depth + 0.3]);
      break;
    case 2:
      positions.push(
        [-benchWidth/3, 0, benchScale.depth + 0.3],
        [benchWidth/3, 0, benchScale.depth + 0.3]
      );
      break;
    case 3:
      positions.push(
        [-benchWidth/2 + 0.3, 0, benchScale.depth + 0.3],
        [0, 0, benchScale.depth + 0.3],
        [benchWidth/2 - 0.3, 0, benchScale.depth + 0.3]
      );
      break;
    case 4:
      positions.push(
        [-benchWidth/2 + 0.4, 0, benchScale.depth + 0.3],
        [-benchWidth/6, 0, benchScale.depth + 0.3],
        [benchWidth/6, 0, benchScale.depth + 0.3],
        [benchWidth/2 - 0.4, 0, benchScale.depth + 0.3]
      );
      break;
    case 5:
      positions.push(
        [-benchWidth/2 + 0.4, 0, benchScale.depth + 0.3],
        [-benchWidth/4, 0, benchScale.depth + 0.3],
        [0, 0, benchScale.depth + 0.3],
        [benchWidth/4, 0, benchScale.depth + 0.3],
        [benchWidth/2 - 0.4, 0, benchScale.depth + 0.3]
      );
      break;
    default:
      positions.push([0, 0, benchScale.depth + 0.3]);
  }
  
  return positions;
};

export default BenchEntity;