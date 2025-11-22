// src/components/ControlPanel/RoomSettings.jsx
import React from 'react';

/**
 * Enhanced room settings with better visual design
 */
const RoomSettings = ({ roomConfig, onRoomConfigChange, onRowsColsChange, isExpanded }) => {
  const handleRoomNameChange = (e) => {
    onRoomConfigChange({ ...roomConfig, roomName: e.target.value });
  };

  const handleRowsChange = (e) => {
    const rows = parseInt(e.target.value) || 1;
    onRowsColsChange(rows, roomConfig.cols);
  };

  const handleColsChange = (e) => {
    const cols = parseInt(e.target.value) || 1;
    onRowsColsChange(roomConfig.rows, cols);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
        <h2 className="text-lg font-semibold text-gray-800">Room Settings</h2>
      </div>
      
      <div className="space-y-4">
        {/* Room Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={roomConfig.roomName}
              onChange={handleRoomNameChange}
              placeholder="Enter room name..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/50 backdrop-blur-sm"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-lg">🏢</span>
            </div>
          </div>
        </div>

        {/* Grid Configuration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Grid Layout
          </label>
          <div className={`grid gap-4 ${isExpanded ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <GridControl
              label="Rows"
              value={roomConfig.rows}
              min={1}
              max={10}
              onChange={handleRowsChange}
              icon="📊"
            />
            <GridControl
              label="Columns"
              value={roomConfig.cols}
              min={1}
              max={10}
              onChange={handleColsChange}
              icon="📐"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Reusable grid control component
 */
const GridControl = ({ label, value, min, max, onChange, icon }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-blue-600 text-center mb-2">
        {value}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default RoomSettings;