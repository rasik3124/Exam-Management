// src/components/ControlPanel/ControlPanel.jsx
import React from 'react';
import RoomSettings from './RoomSettings';
import BenchControls from './BenchControls';
import CapacitySummary from './CapacitySummary';
import ActionButtons from './ActionButtons'; // Fixed import

/**
 * Enhanced control panel with better organization
 */
const ControlPanel = ({
  roomConfig,
  totalBenches,
  totalRoomCapacity,
  maxBenches,
  onRoomConfigChange,
  onBenchCapacityChange,
  onRowsColsChange,
  onAddBench,
  onResetScene,
  onSaveSession,
  onExportJSON,
  isExpanded,
  onToggleExpand
}) => {
  return (
    <div 
      className={`
        bg-gradient-to-b from-white to-gray-50 shadow-xl border-r border-gray-200 
        transition-all duration-300 ease-in-out overflow-y-auto z-10
        ${isExpanded ? 'w-full md:w-96' : 'w-full md:w-80'}
        h-1/3 md:h-full
      `}
    >
      <div className="p-6 space-y-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Room Builder
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Design your perfect room layout
            </p>
          </div>
          <ExpandToggle 
            isExpanded={isExpanded}
            onToggle={onToggleExpand}
          />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-6 overflow-y-auto">
          <RoomSettings
            roomConfig={roomConfig}
            onRoomConfigChange={onRoomConfigChange}
            onRowsColsChange={onRowsColsChange}
            isExpanded={isExpanded}
          />

          <BenchControls
            roomConfig={roomConfig}
            totalBenches={totalBenches}
            maxBenches={maxBenches}
            onBenchCapacityChange={onBenchCapacityChange}
            onAddBench={onAddBench}
            isExpanded={isExpanded}
          />

          <CapacitySummary
            totalBenches={totalBenches}
            totalRoomCapacity={totalRoomCapacity}
            maxBenches={maxBenches}
            isExpanded={isExpanded}
          />
        </div>

        {/* Fixed Action Buttons */}
        <ActionButtons
          onResetScene={onResetScene}
          onSaveSession={onSaveSession}
          onExportJSON={onExportJSON}
          isExpanded={isExpanded}
        />

      </div>
    </div>
  );
};

/**
 * Expand/collapse toggle component
 */
const ExpandToggle = ({ isExpanded, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors group"
      title={isExpanded ? 'Collapse panel' : 'Expand panel'}
    >
      <svg 
        className={`w-5 h-5 text-gray-600 transform transition-transform duration-300 group-hover:scale-110 ${
          isExpanded ? 'rotate-0' : 'rotate-180'
        }`}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
};

export default ControlPanel;