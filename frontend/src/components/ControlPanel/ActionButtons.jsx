  // src/components/ControlPanel/ActionButtons.jsx
  import React, { useRef } from 'react';
  import { gsap } from 'gsap';

  /**
   * Action buttons for reset and export with enhanced visual design
   */
  const ActionButtons = ({ onResetScene, onSaveSession, onExportJSON, isExpanded }) => {
    const resetRef = useRef(null);
    const exportRef = useRef(null);

    const handleResetClick = () => {
      // Animation for reset button
      if (resetRef.current) {
        gsap.to(resetRef.current, {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          onComplete: onResetScene
        });
      } else {
        onResetScene();
      }
    };

    const handleSaveClick = () => {
      gsap.to(exportRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: onSaveSession
      });
    };

    return (
      <div className={`grid gap-3 ${isExpanded ? 'grid-cols-2' : 'grid-cols-1'} pt-4 border-t border-gray-200`}>
        {/* Export Button */}
        <button
          ref={exportRef}
          onClick={onSaveSession}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl px-4 py-3"
        >
          💾 Save to Exam
        </button>

        <button
          onClick={onExportJSON}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl px-4 py-3"
        >
          📤 Export JSON
        </button>

        {/* Reset Button */}
        <button
          ref={resetRef}
          onClick={handleResetClick}
          className="
            flex items-center justify-center space-x-2 px-4 py-3 
            bg-gradient-to-r from-red-500 to-pink-600 
            hover:from-red-600 hover:to-pink-700
            text-white rounded-xl font-semibold 
            transition-all duration-200 
            shadow-lg hover:shadow-xl 
            transform hover:scale-105
            group
          "
        >
          <div className="bg-white/20 p-1 rounded-lg group-hover:scale-110 transition-transform">
            <span className="text-lg">🔄</span>
          </div>
          <span className="text-sm">Reset All</span>
        </button>

        {/* Warning message for reset */}
        <div className="col-span-full">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
            <p className="text-xs text-amber-700">
              ⚠️ Reset will clear all benches and settings
            </p>
          </div>
        </div>
      </div>
    );
  };

  export default ActionButtons;