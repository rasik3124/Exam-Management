// src/components/StudentVisualizer/Tooltip3D.jsx
import React from 'react';
import { Html } from '@react-three/drei';
import { useStudentStore } from '../../stores/studentStore';
import { getStudentColor } from '../../utils/colorUtils';

const Tooltip3D = ({ student }) => {
  const { groupBy } = useStudentStore();
  const color = getStudentColor(student, groupBy);

  return (
    <Html
      position={[0, 4, 0]}
      center
      distanceFactor={10}
      style={{
        pointerEvents: 'none',
        transition: 'all 0.2s ease-out'
      }}
    >
      <div 
        className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border p-4 min-w-48 transform -translate-y-2"
        style={{ borderLeftColor: color, borderLeftWidth: '4px' }}
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <h4 className="font-semibold text-gray-800 text-sm">{student.name}</h4>
          </div>
          
          <div className="text-xs text-gray-600 space-y-1">
            <div><strong>ID:</strong> {student.reg_no}</div>
            <div><strong>Dept:</strong> {student.dept}</div>
            <div><strong>Sem:</strong> {student.sem}</div>
            <div><strong>Subject:</strong> {student.subject}</div>
            {/* REMOVED: bench_id from tooltip */}
          </div>

          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Click to select • Hover to view
            </p>
          </div>
        </div>
      </div>
    </Html>
  );
};

export default Tooltip3D;