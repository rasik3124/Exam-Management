// src/utils/colorUtils.js
export const getStudentColor = (student, groupBy) => {
  const baseColors = {
    dept: {
      'CSE': '#3B82F6',
      'ECE': '#10B981', 
      'MECH': '#EF4444',
      'CIVIL': '#F59E0B',
      'EEE': '#8B5CF6',
      'IT': '#EC4899'
    },
    sem: {
      '1': '#93C5FD',
      '2': '#60A5FA',
      '3': '#3B82F6', 
      '4': '#1D4ED8',
      '5': '#1E40AF',
      '6': '#1E3A8A',
      '7': '#1E3A8A',
      '8': '#1E3A8A'
    },
    subject: {
      'default': '#6B7280'
    }
  };

  const palette = baseColors[groupBy] || baseColors.subject;
  const key = student[groupBy]?.toString();
  return palette[key] || palette.default || '#6B7280';
};

export const lightenColor = (color, percent) => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1);
};