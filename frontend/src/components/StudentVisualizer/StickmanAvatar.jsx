// src/components/StudentVisualizer/StickmanAvatar.jsx (Updated)
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStudentStore } from '../../stores/studentStore';

const StickmanAvatar = ({ student, position, color, isHighlighted = false }) => {
  const groupRef = useRef();
  const { setHoveredStudent, setSelectedStudent, hoveredStudent, selectedStudent } = useStudentStore();

  // Gentle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  const isHovered = hoveredStudent?.id === student.id;
  const isSelected = selectedStudent?.id === student.id;

  const scale = isSelected ? 1.2 : isHovered ? 1.1 : 1;
  const avatarColor = isHighlighted ? lightenColor(color, 30) : color;

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredStudent(student);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHoveredStudent(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedStudent(student);
      }}
    >
      {/* Highlight ring for selected/hovered */}
      {(isHovered || isSelected) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
          <ringGeometry args={[0.6, 0.8, 16]} />
          <meshBasicMaterial 
            color={isSelected ? "#FFD700" : "#FFFFFF"}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}

      {/* Stickman body */}
      <group position={[0, 1.2, 0]}>
        {/* Head */}
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color={avatarColor} />
        </mesh>

        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
          <meshStandardMaterial color={avatarColor} />
        </mesh>

        {/* Arms */}
        <group position={[0, 0.1, 0]}>
          <mesh position={[-0.2, 0, 0]} rotation={[0, 0, -0.5]}>
            <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
            <meshStandardMaterial color={avatarColor} />
          </mesh>
          <mesh position={[0.2, 0, 0]} rotation={[0, 0, 0.5]}>
            <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
            <meshStandardMaterial color={avatarColor} />
          </mesh>
        </group>

        {/* Legs */}
        <group position={[0, -0.3, 0]}>
          <mesh position={[-0.1, -0.2, 0]} rotation={[0, 0, -0.3]}>
            <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
            <meshStandardMaterial color={avatarColor} />
          </mesh>
          <mesh position={[0.1, -0.2, 0]} rotation={[0, 0, 0.3]}>
            <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
            <meshStandardMaterial color={avatarColor} />
          </mesh>
        </group>
      </group>

      {/* Base platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
        <meshStandardMaterial color={avatarColor} transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

// Helper function to lighten colors
const lightenColor = (color, percent) => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
};

export default StickmanAvatar;