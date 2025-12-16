// src/components/VisualRoom/CameraControls.jsx
import React from 'react';

/**
 * Camera control buttons with compact styling.
 * mode = "builder" | "preview"
 */
const CameraControls = ({
  cameraView,
  onViewChange,
  mode = 'builder',
  autoOrbit = false,
  onToggleOrbit,
}) => {
  if (mode === 'preview') {
    // 🔁 Preview mode – only Orbit toggle
    return (
      <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-md border border-gray-200">
        <button
          type="button"
          onClick={onToggleOrbit}
          className={`
            flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all
            ${autoOrbit
              ? 'bg-blue-600 text-gray-800 shadow-md scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
          `}
        >
          <span className="text-sm">{autoOrbit ? '🛰️' : '⭕'}</span>
          <span>Orbit</span>
        </button>
      </div>
    );
  }

  // 🛠 Builder mode – full camera view buttons
  const views = [
    { id: 'overhead', name: 'Top', icon: '📐', description: 'Top-down view' },
    { id: 'side',     name: 'Side', icon: '👁️', description: 'Side view' },
    { id: 'corner',   name: 'Corner', icon: '🎥', description: 'Corner view' },
    { id: 'front',    name: 'Front', icon: '👀', description: 'Front view' },
  ];

  return (
    <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-xl px-2 py-1 shadow-md border border-gray-200">
      <span className="text-[11px] font-medium text-gray-500 pr-2 hidden sm:inline">View</span>
      <div className="flex gap-1">
        {views.map((view) => {
          const isActive = cameraView === view.id;
          return (
            <button
              key={view.id}
              type="button"
              onClick={() => onViewChange(view.id)}
              className={`
                flex flex-col items-center justify-center px-2 py-1 rounded-lg
                text-[10px] font-medium min-w-[52px] transition-all
                ${isActive
                  ? 'bg-blue-600 text-black shadow-sm scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-cyan-400'}
              `}
              title={`${view.name} - ${view.description}`}
            >
              <span className="text-sm leading-none">{view.icon}</span>
              <span className="leading-tight mt-0.5">{view.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CameraControls;
