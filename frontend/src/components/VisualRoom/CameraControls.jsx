// src/components/VisualRoom/CameraControls.jsx
import React from 'react';

/**
 * Camera control buttons with better styling and functionality
 */
const CameraControls = ({ cameraView, onViewChange }) => {
  const views = [
    { 
      id: 'overhead', 
      name: 'Overhead', 
      icon: '📐',
      description: 'Top-down view'
    },
    { 
      id: 'side', 
      name: 'Side', 
      icon: '👁️',
      description: 'Side view'
    },
    { 
      id: 'corner', 
      name: 'Corner', 
      icon: '🎥',
      description: 'Corner view'
    },
    { 
      id: 'front', 
      name: 'Front', 
      icon: '👀',
      description: 'Front view'
    }
  ];

  return (
    <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-gray-200">
      <span className="text-sm font-medium text-gray-600 px-2 hidden sm:block">View:</span>
      <div className="flex space-x-1">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`
              flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-w-[60px]
              ${cameraView === view.id 
                ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }
            `}
            title={`${view.name} - ${view.description}`}
          >
            <span className="text-base">{view.icon}</span>
            <span className="text-xs">{view.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CameraControls;