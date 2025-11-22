// src/components/StudentAnalyzer/StudentAnalyzerPanel.jsx
import React, { useState } from 'react';
import { useStudentAnalyzerStore } from '../../Stores/studentAnalyzerStore'
import { useStudentStore } from '../../stores/studentStore';
import ColorPicker from './ColorPicker';
import PresetManager from './PresetManager';
import GroupCreator from './GroupCreator';

const StudentAnalyzerPanel = () => {
  const [activeTab, setActiveTab] = useState('grouping');
  const { isAnalyzerOpen, setAnalyzerOpen } = useStudentAnalyzerStore();

  if (!isAnalyzerOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 bg-white shadow-2xl border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div>
          <h2 className="text-xl font-bold">Student Analyzer</h2>
          <p className="text-blue-100 text-sm mt-1">Advanced grouping & visualization</p>
        </div>
        <button
          onClick={() => setAnalyzerOpen(false)}
          className="text-white hover:text-blue-200 transition-colors p-2 rounded-full hover:bg-white/10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => setActiveTab('grouping')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'grouping'
              ? 'bg-white text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🎯 Grouping
        </button>
        <button
          onClick={() => setActiveTab('colors')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'colors'
              ? 'bg-white text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🎨 Colors
        </button>
        <button
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'presets'
              ? 'bg-white text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          💾 Presets
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'grouping' && <GroupCreator />}
        {activeTab === 'colors' && <ColorPicker />}
        {activeTab === 'presets' && <PresetManager />}
      </div>

      {/* Quick Actions Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => useStudentAnalyzerStore.getState().resetAnalyzer()}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors text-sm font-medium"
          >
            Reset
          </button>
          <button
            onClick={() => setAnalyzerOpen(false)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalyzerPanel;