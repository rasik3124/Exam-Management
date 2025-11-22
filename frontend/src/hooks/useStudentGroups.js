// src/hooks/useStudentGroups.js
import { useMemo } from 'react';

export const useStudentGroups = (students, groupBy) => {
  return useMemo(() => {
    if (!students.length) return { groups: [], positions: {} };

    const groups = {};
    
    // Group students by selected criteria
    students.forEach(student => {
      const key = student[groupBy] || 'Unknown';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(student);
    });

    // Calculate positions for each group
    const positions = calculateGroupPositions(groups, groupBy);

    return {
      groups: Object.entries(groups).map(([key, students]) => ({
        key,
        students,
        color: getGroupColor(key, groupBy),
        position: positions[key] || { x: 0, z: 0 }
      })),
      positions
    };
  }, [students, groupBy]);
};

const calculateGroupPositions = (groups, groupBy) => {
  const groupKeys = Object.keys(groups);
  const positions = {};
  const total = groupKeys.length;

  if (groupBy === 'dept') {
    // Arrange in grid with more spacing between departments
    const columns = 3;
    const spacingX = 14; // 🔥 wider space between cols
    const spacingZ = 10; // 🔥 more space between rows
    groupKeys.forEach((key, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      positions[key] = {
        x: (col - (columns - 1) / 2) * spacingX,
        z: row * -spacingZ
      };
    });

  } else if (groupBy === 'sem') {
    // Arrange in line but with proper separation
    const spacing = 10;
    groupKeys.forEach((key, index) => {
      positions[key] = {
        x: (index - (groupKeys.length - 1) / 2) * spacing,
        z: 0
      };
    });

  } else {
    // Circular arrangement for subjects with radius scaling
    const baseRadius = 12; // 🔥 increase for more gap
    const dynamicRadius = baseRadius + total * 1.5; 
    groupKeys.forEach((key, index) => {
      const angle = (index / total) * Math.PI * 2;
      positions[key] = {
        x: Math.cos(angle) * dynamicRadius,
        z: Math.sin(angle) * dynamicRadius
      };
    });
  }

  return positions;
};


const getGroupColor = (key, groupBy) => {
  const colorPalettes = {
    dept: {
      'CSE': '#3B82F6', // Blue
      'ECE': '#10B981', // Green
      'MECH': '#EF4444', // Red
      'CIVIL': '#F59E0B', // Amber
      'EEE': '#8B5CF6', // Violet
      'IT': '#EC4899' // Pink
    },
    sem: {
      '1': '#93C5FD', // Light Blue
      '2': '#60A5FA',
      '3': '#3B82F6',
      '4': '#1D4ED8',
      '5': '#1E40AF',
      '6': '#1E3A8A',
      '7': '#1E3A8A',
      '8': '#1E3A8A'
    },
    subject: {
      'default': '#6B7280' // Gray
    }
  };

  const palette = colorPalettes[groupBy] || colorPalettes.subject;
  return palette[key] || palette.default || '#6B7280';
};