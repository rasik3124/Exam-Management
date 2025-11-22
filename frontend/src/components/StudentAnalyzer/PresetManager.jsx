// src/components/StudentAnalyzer/PresetManager.jsx
import React, { useState } from 'react';
import { useStudentAnalyzerStore } from '../../Stores/studentAnalyzerStore';
import { useStudentStore } from '../../stores/studentStore';

const PresetManager = () => {
  const { savedPresets, activePreset, saveAsPreset, loadPreset, deletePreset } = useStudentAnalyzerStore();
  const { students } = useStudentStore();
  const [newPresetName, setNewPresetName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState(null);

  const handleSavePreset = () => {
    if (!newPresetName.trim()) return;
    
    saveAsPreset(newPresetName);
    setNewPresetName('');
    setShowSaveDialog(false);
  };

  const handleLoadPreset = (presetId) => {
    loadPreset(presetId);
  };

  const handleDeletePreset = (presetId) => {
    deletePreset(presetId);
    setPresetToDelete(null);
  };

  const getPresetStats = (preset) => {
    const totalStudents = Object.values(preset.grouping.customGroups).reduce(
      (total, group) => total + group.students.length, 0
    );
    
    return {
      totalGroups: preset.grouping.customGroups.length,
      totalStudents,
      groupingType: preset.grouping.type,
      savedDate: new Date(preset.timestamp).toLocaleDateString()
    };
  };

  const exportPreset = (preset) => {
    const dataStr = JSON.stringify(preset, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `student-preset-${preset.name}-${preset.timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importPreset = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedPreset = JSON.parse(e.target.result);
        
        // Validate preset structure
        if (importedPreset.grouping && importedPreset.colors) {
          // Add to saved presets
          const newPreset = {
            ...importedPreset,
            id: Date.now().toString(),
            timestamp: new Date().toISOString()
          };
          
          useStudentAnalyzerStore.getState().savedPresets.push(newPreset);
          alert(`Preset "${importedPreset.name}" imported successfully!`);
        } else {
          alert('Invalid preset file format');
        }
      } catch (error) {
        alert('Error importing preset: ' + error.message);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  return (
    <div className="p-6">
      {/* Header and Save Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Preset Manager</h3>
          <p className="text-sm text-gray-600">Save and load grouping configurations</p>
        </div>
        <button
          onClick={() => setShowSaveDialog(true)}
          disabled={students.length === 0}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg transition-colors text-sm font-medium flex items-center space-x-2"
        >
          <span>💾</span>
          <span>Save Current</span>
        </button>
      </div>

      {/* Save Preset Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Save Current Configuration</h4>
            
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-700">
                <p className="font-semibold mb-2">Configuration Summary:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Grouping Type: {useStudentAnalyzerStore.getState().currentGrouping.type}</li>
                  <li>• Custom Groups: {useStudentAnalyzerStore.getState().currentGrouping.customGroups.length}</li>
                  <li>• Color Assignments: {Object.keys(useStudentAnalyzerStore.getState().groupColors).length}</li>
                </ul>
              </div>
            </div>
            
            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="Enter preset name..."
              className="w-full p-3 border border-gray-300 rounded-lg text-sm mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleSavePreset()}
            />
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreset}
                disabled={!newPresetName.trim()}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
              >
                Save Preset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {presetToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Delete Preset</h4>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{savedPresets.find(p => p.id === presetToDelete)?.name}"? 
              This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setPresetToDelete(null)}
                className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePreset(presetToDelete)}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Preset */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
        <h4 className="font-semibold text-purple-800 mb-3">Import Preset</h4>
        <div className="flex items-center space-x-3">
          <label className="flex-1">
            <input
              type="file"
              accept=".json"
              onChange={importPreset}
              className="hidden"
              id="preset-import"
            />
            <div className="w-full p-3 border-2 border-dashed border-purple-300 rounded-lg text-center cursor-pointer hover:border-purple-400 transition-colors">
              <div className="text-purple-500 text-sm">
                📁 Click to import preset file
              </div>
            </div>
          </label>
        </div>
        <p className="text-xs text-purple-600 mt-2">
          Import a previously exported preset JSON file
        </p>
      </div>

      {/* Preset List */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-3">Saved Presets ({savedPresets.length})</h4>
        
        {savedPresets.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-4xl mb-2">📂</div>
            <p className="text-gray-500 text-sm">No presets saved yet</p>
            <p className="text-gray-400 text-xs mt-1">Save your current configuration to get started</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {savedPresets.map((preset) => {
              const stats = getPresetStats(preset);
              const isActive = activePreset === preset.id;
              
              return (
                <div
                  key={preset.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-semibold text-gray-800">{preset.name}</h5>
                        {isActive && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Saved on {stats.savedDate} • {stats.groupingType} grouping
                      </p>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => exportPreset(preset)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                        title="Export preset"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setPresetToDelete(preset.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Delete preset"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Preset Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-semibold text-gray-800">{stats.totalGroups}</div>
                      <div className="text-xs text-gray-500">Groups</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-semibold text-gray-800">{stats.totalStudents}</div>
                      <div className="text-xs text-gray-500">Students</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-semibold text-gray-800 capitalize">{stats.groupingType}</div>
                      <div className="text-xs text-gray-500">Type</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleLoadPreset(preset.id)}
                      className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {isActive ? '✓ Loaded' : 'Load Preset'}
                    </button>
                  </div>

                  {/* Color Preview */}
                  {Object.keys(preset.colors).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-500 mb-2">Color assignments:</div>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(preset.colors).slice(0, 6).map(([group, color]) => (
                          <div
                            key={group}
                            className="w-4 h-4 rounded border border-white shadow-sm"
                            style={{ backgroundColor: color }}
                            title={group}
                          />
                        ))}
                        {Object.keys(preset.colors).length > 6 && (
                          <div className="text-xs text-gray-400 px-1">
                            +{Object.keys(preset.colors).length - 6} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preset Usage Tips */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
        <h4 className="font-semibold text-green-800 mb-2 flex items-center">
          <span className="mr-2">💡</span>
          Preset Tips
        </h4>
        <ul className="text-xs text-green-700 space-y-1">
          <li>• Save different grouping strategies for different exam scenarios</li>
          <li>• Export presets to share with other instructors</li>
          <li>• Use color-coded groups for quick visual identification</li>
          <li>• Combine custom groups with automatic grouping for complex scenarios</li>
        </ul>
      </div>
    </div>
  );
};

export default PresetManager;