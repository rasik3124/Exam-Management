// src/components/StudentAnalyzer/ColorPicker.jsx
import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useStudentAnalyzerStore } from '../../Stores/studentAnalyzerStore';
import { useEnhancedStudentGroups } from '../../hooks/useEnhancedStudentGroups';
import { useStudentStore } from '../../stores/studentStore';

const ColorPicker = () => {
  const { students } = useStudentStore();
  const { groupColors, setGroupColor, setHoveredGroup } = useStudentAnalyzerStore();
  const { groups } = useEnhancedStudentGroups(students, 'dept');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [currentColor, setCurrentColor] = useState('#3B82F6');

  const handleColorChange = (color) => {
    setCurrentColor(color);
    if (selectedGroup) {
      setGroupColor(selectedGroup.key, color);
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Group Color Assignment</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Group List */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Select Group</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {groups.map(group => (
              <button
                key={group.key}
                onClick={() => {
                  setSelectedGroup(group);
                  setCurrentColor(groupColors[group.key] || group.color);
                }}
                onMouseEnter={() => setHoveredGroup(group.key)}
                onMouseLeave={() => setHoveredGroup(null)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                  selectedGroup?.key === group.key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: groupColors[group.key] || group.color }}
                />
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm text-gray-800">{group.name}</div>
                  <div className="text-xs text-gray-500">{group.students.length} students</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Color Selection</h4>
          {selectedGroup ? (
            <div className="space-y-4">
              <HexColorPicker color={currentColor} onChange={handleColorChange} />
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div 
                  className="w-12 h-12 rounded-lg border-2 border-white shadow-md"
                  style={{ backgroundColor: currentColor }}
                />
                <div>
                  <div className="font-medium text-sm">{selectedGroup.name}</div>
                  <div className="text-xs text-gray-500">{currentColor}</div>
                </div>
              </div>

              {/* Quick Color Presets */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Quick Colors</div>
                <div className="grid grid-cols-5 gap-2">
                  {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'].map(color => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className="w-8 h-8 rounded border-2 border-white shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🎨</div>
                <p className="text-sm">Select a group to assign colors</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;