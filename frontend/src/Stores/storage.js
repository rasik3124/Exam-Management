// store/storage.js
// Storage utilities for persistent data management

const STORAGE_KEYS = {
  STUDENT_DATA: 'exam-student-data',
  TIMETABLE_DATA: 'exam-timetable-data',
  SUBJECT_MAPPINGS: 'exam-subject-mappings',
  ERROR_BIN: 'exam-error-bin',
  UPLOAD_CONFIG: 'exam-upload-config',
  ATOMIC_READINESS: 'exam-atomic-readiness'
};

export const storage = {
  // Save data to localStorage
  setItem(key, data) {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
      return false;
    }
  },

  // Get data from localStorage
  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  },

  // Remove data from localStorage
  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  },

  // Clear all exam-related data
  clearAllExamData() {
    Object.values(STORAGE_KEYS).forEach(key => {
      this.removeItem(key);
    });
    return true;
  },

  // Student data specific methods
  saveStudentData(data) {
    return this.setItem(STORAGE_KEYS.STUDENT_DATA, data);
  },

  loadStudentData() {
    return this.getItem(STORAGE_KEYS.STUDENT_DATA, []);
  },

  // Timetable data specific methods
  saveTimetableData(data) {
    return this.setItem(STORAGE_KEYS.TIMETABLE_DATA, data);
  },

  loadTimetableData() {
    return this.getItem(STORAGE_KEYS.TIMETABLE_DATA, []);
  },

  // Subject mappings specific methods
  saveSubjectMappings(mappings) {
    return this.setItem(STORAGE_KEYS.SUBJECT_MAPPINGS, mappings);
  },

  loadSubjectMappings() {
    return this.getItem(STORAGE_KEYS.SUBJECT_MAPPINGS, {});
  },

  // Error bin specific methods
  saveErrorBin(errors) {
    return this.setItem(STORAGE_KEYS.ERROR_BIN, errors);
  },

  loadErrorBin() {
    return this.getItem(STORAGE_KEYS.ERROR_BIN, []);
  },

  // Upload configuration
  saveUploadConfig(config) {
    return this.setItem(STORAGE_KEYS.UPLOAD_CONFIG, config);
  },

  loadUploadConfig() {
    return this.getItem(STORAGE_KEYS.UPLOAD_CONFIG, {
      studentHeaders: null,
      timetableHeaders: null
    });
  },

  // Atomic readiness status
  markAtomicCheckSeen(examId) {
    const key = `${STORAGE_KEYS.ATOMIC_READINESS}_${examId}`;
    return this.setItem(key, true);
  },

  hasSeenAtomicCheck(examId) {
    const key = `${STORAGE_KEYS.ATOMIC_READINESS}_${examId}`;
    return this.getItem(key, false);
  },

  // Backup and restore functionality
  createBackup() {
    const backup = {};
    Object.values(STORAGE_KEYS).forEach(key => {
      backup[key] = this.getItem(key);
    });
    backup.timestamp = new Date().toISOString();
    backup.version = '1.0';
    
    return backup;
  },

  restoreBackup(backup) {
    if (!backup || !backup.timestamp) {
      throw new Error('Invalid backup format');
    }

    try {
      Object.entries(backup).forEach(([key, value]) => {
        if (Object.values(STORAGE_KEYS).includes(key) && value !== undefined) {
          this.setItem(key, value);
        }
      });
      return true;
    } catch (error) {
      console.error('Error restoring backup:', error);
      return false;
    }
  },

  // Export data for download
  exportData() {
    const data = this.createBackup();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exam-data-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Import data from file
  importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (this.restoreBackup(data)) {
            resolve(true);
          } else {
            reject(new Error('Failed to restore backup'));
          }
        } catch (error) {
          reject(new Error('Invalid backup file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  // Storage statistics
  getStorageStats() {
    const stats = {
      totalSize: 0,
      items: {}
    };

    Object.values(STORAGE_KEYS).forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        const size = new Blob([data]).size;
        stats.items[key] = {
          size,
          sizeKB: (size / 1024).toFixed(2),
          itemCount: data ? JSON.parse(data)?.length || 1 : 0
        };
        stats.totalSize += size;
      }
    });

    stats.totalSizeKB = (stats.totalSize / 1024).toFixed(2);
    stats.totalSizeMB = (stats.totalSize / (1024 * 1024)).toFixed(2);

    return stats;
  },

  // Check if storage is getting full (warning at 4MB, max 5MB for most browsers)
  checkStorageHealth() {
    const stats = this.getStorageStats();
    const usedMB = parseFloat(stats.totalSizeMB);
    
    if (usedMB > 4) {
      return { status: 'warning', message: `Storage usage high: ${usedMB}MB` };
    } else if (usedMB > 4.5) {
      return { status: 'error', message: `Storage nearly full: ${usedMB}MB` };
    }
    
    return { status: 'healthy', message: `Storage usage: ${usedMB}MB` };
  },

  // Auto-cleanup old data if needed
  autoCleanup() {
    const health = this.checkStorageHealth();
    if (health.status === 'error') {
      // Remove oldest data or prompt user
      console.warn('Storage critically full, consider cleanup');
      return false;
    }
    return true;
  }
};

// Export storage keys for external use
export { STORAGE_KEYS };

// Default export
export default storage;