// src/components/StudentVisualizer/FilterPanel.jsx
import React, { useState } from 'react';
import { useStudentStore } from '../../stores/studentStore';

const FilterPanel = () => {
  const { groupBy, setGroupBy, students } = useStudentStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const groupOptions = [
    { value: 'dept', label: 'Department', icon: '🏛️', description: 'Group by department' },
    { value: 'sem', label: 'Semester', icon: '📚', description: 'Group by semester' },
    { value: 'subject', label: 'Subject', icon: '📖', description: 'Group by subject' }
    // REMOVED: bench_id grouping option
  ];

  // Get unique values for each grouping option
  const getUniqueValues = (field) => {
    return [...new Set(students.map(s => s[field]))].sort();
  };

  if (isCollapsed) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200">
        <button
          onClick={() => setIsCollapsed(false)}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="font-medium">Show Controls</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-gray-200 min-w-80 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Visualization Controls</h3>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Group By Selector */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Group Students By
        </label>
        <div className="space-y-3">
          {groupOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setGroupBy(option.value)}
              className={`w-full flex items-start space-x-4 p-4 rounded-xl text-left transition-all ${
                groupBy === option.value
                  ? 'bg-blue-50 border-2 border-blue-200 shadow-sm'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <span className="text-2xl flex-shrink-0">{option.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 mb-1">{option.label}</div>
                <div className="text-xs text-gray-500">{option.description}</div>
                <div className="mt-2 text-xs font-medium text-blue-600">
                  {getUniqueValues(option.value).length} groups • {' '}
                  {students.filter(s => s[option.value]).length} students
                </div>
              </div>
              {groupBy === option.value && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Current Groups Summary */}
      <div className="border-t pt-6 border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Current Groups
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {getUniqueValues(groupBy).map(value => (
            <div key={value} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: groupOptions.find(opt => opt.value === groupBy)?.value === 'dept' 
                      ? getDepartmentColor(value) 
                      : '#6B7280' 
                  }}
                ></div>
                <span className="text-sm font-medium text-gray-700">{value}</span>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                {students.filter(s => s[groupBy] === value).length}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="text-blue-500 mt-0.5">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm text-blue-700">
            <p className="font-semibold mb-1">Quick Tips</p>
            <ul className="space-y-1 text-xs">
              <li>• Hover over students to see details</li>
              <li>• Click students to select and view full info</li>
              <li>• Use mouse to rotate, scroll to zoom</li>
              <li>• Camera auto-rotates when inactive</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for department colors
const getDepartmentColor = (dept) => {
  const colors = {
    'CSE': '#3B82F6',
    'ECE': '#10B981',
    'MECH': '#EF4444',
    'CIVIL': '#F59E0B',
    'EEE': '#8B5CF6',
    'IT': '#EC4899'
  };
  return colors[dept] || '#6B7280';
};

export default FilterPanel;