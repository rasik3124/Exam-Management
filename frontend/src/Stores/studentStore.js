// src/stores/studentStore.js
import { create } from 'zustand';

export const useStudentStore = create((set, get) => ({
  // Student data
  students: [],
  loading: false,
  error: null,
  
  // Visualization settings
  groupBy: 'dept',
  filterBy: null,
  hoveredStudent: null,
  selectedStudent: null,
  
  // Camera controls
  userActive: false,
  cameraOrbitEnabled: true,
  
  // Actions
  setStudents: (students) => set({ students, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  setGroupBy: (groupBy) => set({ groupBy }),
  setFilterBy: (filterBy) => set({ filterBy }),
  setHoveredStudent: (hoveredStudent) => set({ hoveredStudent }),
  setSelectedStudent: (selectedStudent) => set({ selectedStudent }),
  
  setUserActive: (userActive) => set({ userActive }),
  setCameraOrbitEnabled: (cameraOrbitEnabled) => set({ cameraOrbitEnabled }),
  
  // Reset state
  reset: () => set({
    students: [],
    loading: false,
    error: null,
    groupBy: 'dept',
    filterBy: null,
    hoveredStudent: null,
    selectedStudent: null,
    userActive: false,
    cameraOrbitEnabled: true
  })
}));