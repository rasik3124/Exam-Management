// src/components/ControlPanel/BenchControls.jsx
import React from 'react';

/**
 * Bench controls section for managing bench capacity
 */
const BenchControls = ({
  roomConfig,
  totalBenches,
  maxBenches,
  onBenchCapacityChange,
  onAddBench,
  isExpanded
}) => {
  const handleCapacityChange = (e) => {
    const capacity = parseInt(e.target.value) || 1;
    onBenchCapacityChange(capacity);
  };

  const canAddBench = roomConfig.roomName && totalBenches < maxBenches;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-2 h-6 bg-green-600 rounded-full"></div>
        <h2 className="text-lg font-semibold text-gray-800">Bench Controls</h2>
      </div>

      <div className="space-y-5">
        {/* Bench Capacity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Bench Capacity
            </label>
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm font-bold">
              {roomConfig.benchCapacity} {roomConfig.benchCapacity === 1 ? 'seat' : 'seats'}
            </div>
          </div>
          
          <input
            type="range"
            min="1"
            max="5"
            value={roomConfig.benchCapacity}
            onChange={handleCapacityChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span className="flex items-center space-x-1">
              <span>1</span>
              <span>💺</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>2</span>
              <span>💺💺</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>3</span>
              <span>💺💺💺</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>4</span>
              <span>💺💺💺💺</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>5</span>
              <span>💺💺💺💺💺</span>
            </span>
          </div>
        </div>

        {/* Add Bench Button */}
        <button
          onClick={onAddBench}
          disabled={!canAddBench}
          className={`
            w-full flex items-center justify-center space-x-3 px-4 py-4 
            rounded-xl font-semibold transition-all duration-200 
            shadow-lg hover:shadow-xl transform hover:scale-105
            ${canAddBench 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <div className={`p-2 rounded-lg ${canAddBench ? 'bg-white/20' : 'bg-gray-300'}`}>
            <span className="text-xl">➕</span>
          </div>
          <div className="text-left">
            <div className="font-semibold">Add Bench</div>
            <div className="text-xs opacity-80">
              {canAddBench 
                ? `${maxBenches - totalBenches} slots available` 
                : 'Name room first or grid full'
              }
            </div>
          </div>
        </button>

        {/* Bench Status */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Bench Status:</span>
            <span className={`font-semibold ${
              totalBenches === maxBenches ? 'text-green-600' : 'text-blue-600'
            }`}>
              {totalBenches}/{maxBenches} placed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(totalBenches / maxBenches) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenchControls;