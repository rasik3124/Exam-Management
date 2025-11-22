// src/hooks/useEnhancedStudentGroups.js
import { useMemo } from 'react';
import { useStudentAnalyzerStore } from '../Stores/studentAnalyzerStore';

export const useEnhancedStudentGroups = (students, groupBy) => {
  const { currentGrouping, groupColors, hoveredGroup } = useStudentAnalyzerStore();

  return useMemo(() => {
    if (!students || !students.length) {
      return { 
        groups: [], 
        statistics: {
          totalStudents: 0,
          totalGroups: 0,
          groupDistribution: {}
        }
      };
    }

    let groups = [];
    const statistics = {
      totalStudents: students.length,
      totalGroups: 0,
      groupDistribution: {}
    };

    // Determine actual grouping method
    const effectiveGroupBy = currentGrouping.type === 'custom' ? 'custom' : groupBy;

    switch (effectiveGroupBy) {
      case 'custom':
        // Use custom groups from analyzer
        if (currentGrouping.customGroups && currentGrouping.customGroups.length > 0) {
          groups = currentGrouping.customGroups.map((customGroup, index) => {
            const groupKey = customGroup.id;
            const angle = (index / Math.max(currentGrouping.customGroups.length, 1)) * Math.PI * 2;
            const radius = 8 + (index % 3) * 2;
            
            return {
              key: groupKey,
              name: customGroup.name,
              students: customGroup.students || [],
              color: groupColors[groupKey] || getDefaultColor(index),
              position: {
                x: Math.cos(angle) * radius,
                z: Math.sin(angle) * radius
              },
              isCustom: true,
              isHovered: hoveredGroup === groupKey
            };
          });
        } else {
          // Fallback to department grouping if no custom groups
          groups = createStandardGroups(students, 'dept', groupColors);
        }
        break;

      case 'combined':
        // Combined grouping (primary + secondary field)
        if (currentGrouping.primaryField && currentGrouping.secondaryField) {
          groups = createCombinedGroups(students, currentGrouping.primaryField, currentGrouping.secondaryField, groupColors);
        } else {
          // Fallback if fields not set
          groups = createStandardGroups(students, 'dept', groupColors);
        }
        break;

      default:
        // Standard grouping (dept, sem, etc.)
        groups = createStandardGroups(students, effectiveGroupBy, groupColors);
    }

    // Calculate statistics safely
    statistics.totalGroups = groups.length;
    statistics.groupDistribution = groups.reduce((acc, group) => {
      acc[group.name] = group.students.length;
      return acc;
    }, {});

    return { groups, statistics };

  }, [students, groupBy, currentGrouping, groupColors, hoveredGroup]);
};

// Helper function for standard grouping
const createStandardGroups = (students, field, groupColors) => {
  if (!students || !students.length) return [];

  const standardGroups = students.reduce((acc, student) => {
    const groupValue = student[field] || 'Unknown';
    if (!acc[groupValue]) {
      acc[groupValue] = [];
    }
    acc[groupValue].push(student);
    return acc;
  }, {});

  return Object.entries(standardGroups).map(([value, students], index) => {
    const angle = (index / Math.max(Object.keys(standardGroups).length, 1)) * Math.PI * 2;
    const radius = 6 + (index % 2) * 3;
    
    return {
      key: value,
      name: value,
      students,
      color: groupColors[value] || getDefaultColor(index),
      position: {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius
      },
      isStandard: true
    };
  });
};

// Helper function for combined grouping
const createCombinedGroups = (students, primaryField, secondaryField, groupColors) => {
  if (!students || !students.length) return [];

  const combinedGroups = {};
  
  students.forEach(student => {
    const primaryValue = student[primaryField] || 'Unknown';
    const secondaryValue = student[secondaryField] || 'Unknown';
    const combinedKey = `${primaryValue}_${secondaryValue}`;
    
    if (!combinedGroups[combinedKey]) {
      combinedGroups[combinedKey] = {
        students: [],
        primaryValue,
        secondaryValue
      };
    }
    combinedGroups[combinedKey].students.push(student);
  });

  return Object.entries(combinedGroups).map(([key, data], index) => {
    const angle = (index / Math.max(Object.keys(combinedGroups).length, 1)) * Math.PI * 2;
    const radius = 10 + (index % 4) * 2;
    
    return {
      key,
      name: `${data.primaryValue} + ${data.secondaryValue}`,
      students: data.students,
      color: groupColors[key] || getCombinedColor(data.primaryValue, data.secondaryValue),
      position: {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius
      },
      isCombined: true
    };
  });
};

// Color utility functions
const getDefaultColor = (index) => {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];
  return colors[index % colors.length];
};

const getCombinedColor = (primary, secondary) => {
  const prime = hashString(primary);
  const second = hashString(secondary);
  return `hsl(${(prime + second) % 360}, 70%, 50%)`;
};

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};