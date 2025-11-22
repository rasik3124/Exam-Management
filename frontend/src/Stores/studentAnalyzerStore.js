// src/stores/studentAnalyzerStore.js (Fixed initial state)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper to get initial state
const getInitialState = () => ({
  // Current grouping configuration
  currentGrouping: {
    type: 'dept', // 'dept', 'sem', 'custom', 'combined'
    primaryField: 'dept',
    secondaryField: null,
    customGroups: []
  },
  
  // Color assignments
  groupColors: {},
  customColors: {},
  
  // Group configurations (presets)
  savedPresets: [],
  activePreset: null,
  
  // UI State
  isAnalyzerOpen: false,
  selectedGroups: [],
  hoveredGroup: null,
});

export const useStudentAnalyzerStore = create(
  persist(
    (set, get) => ({
      ...getInitialState(),
      
      // Actions
      setGroupingType: (type) => set((state) => ({ 
        currentGrouping: { 
          ...state.currentGrouping, 
          type,
          // Reset secondary field when switching away from combined
          ...(type !== 'combined' && { secondaryField: null })
        }
      })),
      
      setPrimaryField: (field) => set((state) => ({ 
        currentGrouping: { ...state.currentGrouping, primaryField: field }
      })),
      
      setSecondaryField: (field) => set((state) => ({ 
        currentGrouping: { ...state.currentGrouping, secondaryField: field }
      })),
      
      createCustomGroup: (groupData) => set((state) => ({
        currentGrouping: {
          ...state.currentGrouping,
          customGroups: [...(state.currentGrouping.customGroups || []), groupData]
        }
      })),
      
      updateCustomGroup: (groupId, updates) => set((state) => ({
        currentGrouping: {
          ...state.currentGrouping,
          customGroups: (state.currentGrouping.customGroups || []).map(group =>
            group.id === groupId ? { ...group, ...updates } : group
          )
        }
      })),
      
      deleteCustomGroup: (groupId) => set((state) => ({
        currentGrouping: {
          ...state.currentGrouping,
          customGroups: (state.currentGrouping.customGroups || []).filter(group => group.id !== groupId)
        }
      })),
      
      setGroupColor: (groupId, color) => set((state) => ({
        groupColors: { ...state.groupColors, [groupId]: color }
      })),
      
      saveAsPreset: (presetName) => set((state) => {
        const newPreset = {
          id: Date.now().toString(),
          name: presetName,
          grouping: { ...state.currentGrouping },
          colors: { ...state.groupColors },
          timestamp: new Date().toISOString()
        };
        
        return {
          savedPresets: [...state.savedPresets, newPreset],
          activePreset: newPreset.id
        };
      }),
      
      loadPreset: (presetId) => set((state) => {
        const preset = state.savedPresets.find(p => p.id === presetId);
        if (!preset) return state;
        
        return {
          currentGrouping: { ...preset.grouping },
          groupColors: { ...preset.colors },
          activePreset: presetId
        };
      }),
      
      deletePreset: (presetId) => set((state) => ({
        savedPresets: state.savedPresets.filter(p => p.id !== presetId),
        activePreset: state.activePreset === presetId ? null : state.activePreset
      })),
      
      mergeGroups: (groupIds, mergedName) => set((state) => {
        const currentGroups = state.currentGrouping.customGroups || [];
        const mergedStudents = [];
        const updatedCustomGroups = currentGroups.filter(group => 
          !groupIds.includes(group.id)
        );
        
        groupIds.forEach(groupId => {
          const group = currentGroups.find(g => g.id === groupId);
          if (group) {
            mergedStudents.push(...group.students);
          }
        });
        
        const mergedGroup = {
          id: `merged_${Date.now()}`,
          name: mergedName,
          students: mergedStudents,
          type: 'merged'
        };
        
        return {
          currentGrouping: {
            ...state.currentGrouping,
            customGroups: [...updatedCustomGroups, mergedGroup]
          }
        };
      }),
      
      splitGroup: (groupId, field) => set((state) => {
        const currentGroups = state.currentGrouping.customGroups || [];
        const group = currentGroups.find(g => g.id === groupId);
        if (!group) return state;
        
        const fieldValues = [...new Set(group.students.map(s => s[field]))];
        const newGroups = fieldValues.map(value => ({
          id: `split_${Date.now()}_${value}`,
          name: `${group.name} - ${value}`,
          students: group.students.filter(s => s[field] === value),
          type: 'split'
        }));
        
        return {
          currentGrouping: {
            ...state.currentGrouping,
            customGroups: [
              ...currentGroups.filter(g => g.id !== groupId),
              ...newGroups
            ]
          }
        };
      }),
      
      setAnalyzerOpen: (isOpen) => set({ isAnalyzerOpen: isOpen }),
      setSelectedGroups: (groups) => set({ selectedGroups: groups }),
      setHoveredGroup: (groupId) => set({ hoveredGroup: groupId }),
      
      // Reset analyzer state
      resetAnalyzer: () => set({
        ...getInitialState()
      })
    }),
    {
      name: 'student-analyzer-storage',
      partialize: (state) => ({ 
        savedPresets: state.savedPresets || [],
        groupColors: state.groupColors || {},
        currentGrouping: state.currentGrouping || getInitialState().currentGrouping
      }),
      // Handle migration from older versions
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Ensure all required fields exist
          if (!state.currentGrouping) {
            state.currentGrouping = getInitialState().currentGrouping;
          }
          if (!state.groupColors) {
            state.groupColors = {};
          }
          if (!state.savedPresets) {
            state.savedPresets = [];
          }
        }
      }
    }
  )
);