// src/components/StudentAnalyzer/GroupCreator.jsx
import React, { useState } from 'react';
import { useStudentAnalyzerStore } from '../../Stores/studentAnalyzerStore';
import { useStudentStore } from '../../stores/studentStore';

const GroupCreator = () => {
  const { students } = useStudentStore();
  const { 
    currentGrouping, 
    setGroupingType, 
    setPrimaryField, 
    setSecondaryField,
    createCustomGroup,
    mergeGroups,
    splitGroup
  } = useStudentAnalyzerStore();

  const [newGroupName, setNewGroupName] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [mergeGroupIds, setMergeGroupIds] = useState([]);

  const availableFields = [
    { value: 'dept', label: 'Department', icon: '🏛️' },
    { value: 'sem', label: 'Semester', icon: '📚' },
    { value: 'subject', label: 'Subject', icon: '📖' },
    { value: 'bench_id', label: 'Bench', icon: '💺' }
  ];

  const handleCreateCustomGroup = () => {
    if (!newGroupName.trim() || selectedStudents.length === 0) return;

    const newGroup = {
      id: `custom_${Date.now()}`,
      name: newGroupName,
      students: selectedStudents,
      type: 'manual'
    };

    createCustomGroup(newGroup);
    setNewGroupName('');
    setSelectedStudents([]);
  };

  const handleMergeGroups = () => {
    if (mergeGroupIds.length < 2 || !newGroupName.trim()) return;
    mergeGroups(mergeGroupIds, newGroupName);
    setMergeGroupIds([]);
    setNewGroupName('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Grouping Type Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Grouping Strategy</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setGroupingType('dept')}
            className={`p-4 rounded-xl border-2 transition-all ${
              currentGrouping.type === 'dept'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">🏛️</div>
            <div className="text-sm font-medium">Department</div>
          </button>
          
          <button
            onClick={() => setGroupingType('sem')}
            className={`p-4 rounded-xl border-2 transition-all ${
              currentGrouping.type === 'sem'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">📚</div>
            <div className="text-sm font-medium">Semester</div>
          </button>
          
          <button
            onClick={() => setGroupingType('combined')}
            className={`p-4 rounded-xl border-2 transition-all ${
              currentGrouping.type === 'combined'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">🔗</div>
            <div className="text-sm font-medium">Combined</div>
          </button>
          
          <button
            onClick={() => setGroupingType('custom')}
            className={`p-4 rounded-xl border-2 transition-all ${
              currentGrouping.type === 'custom'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-sm font-medium">Custom</div>
          </button>
        </div>
      </div>

      {/* Combined Grouping Fields */}
      {currentGrouping.type === 'combined' && (
        <div className="space-y-4 p-4 bg-blue-50 rounded-xl">
          <h4 className="font-semibold text-blue-800">Combined Fields</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Field</label>
              <select
                value={currentGrouping.primaryField}
                onChange={(e) => setPrimaryField(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              >
                {availableFields.map(field => (
                  <option key={field.value} value={field.value}>
                    {field.icon} {field.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Field</label>
              <select
                value={currentGrouping.secondaryField || ''}
                onChange={(e) => setSecondaryField(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Select field...</option>
                {availableFields.map(field => (
                  <option key={field.value} value={field.value}>
                    {field.icon} {field.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Custom Group Creation */}
      {currentGrouping.type === 'custom' && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Create Custom Group</h4>
          
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Enter group name..."
            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
          />
          
          <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
            {students.map(student => (
              <label key={student.id} className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                <input
                  type="checkbox"
                  checked={selectedStudents.some(s => s.id === student.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStudents(prev => [...prev, student]);
                    } else {
                      setSelectedStudents(prev => prev.filter(s => s.id !== student.id));
                    }
                  }}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-sm">{student.name}</div>
                  <div className="text-xs text-gray-500">{student.dept} • Sem {student.sem}</div>
                </div>
              </label>
            ))}
          </div>
          
          <button
            onClick={handleCreateCustomGroup}
            disabled={!newGroupName.trim() || selectedStudents.length === 0}
            className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg transition-colors font-medium"
          >
            Create Group ({selectedStudents.length} students)
          </button>
        </div>
      )}

      {/* Current Custom Groups */}
      {currentGrouping.customGroups.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Custom Groups</h4>
          <div className="space-y-2">
            {currentGrouping.customGroups.map(group => (
              <div key={group.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{group.name}</div>
                  <div className="text-xs text-gray-500">{group.students.length} students</div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => splitGroup(group.id, 'dept')}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Split
                  </button>
                  <button
                    onClick={() => setMergeGroupIds(prev => [...prev, group.id])}
                    className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                  >
                    Merge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupCreator;