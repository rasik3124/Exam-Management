// src/components/StudentVisualizer/ExcelUploader.jsx
import React, { useCallback } from 'react';
import { useStudentStore } from '../../stores/studentStore';
import { useExcelParser } from '../../hooks/useExcelParser';
import FileDropZone from '../UI/FileDropZone';

const ExcelUploader = () => {
  const { setStudents, setLoading, setError } = useStudentStore();
  const { parseExcelFile, loading, error } = useExcelParser();

  const handleFileUpload = useCallback(async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setError('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    setLoading(true);
    try {
      const students = await parseExcelFile(file);
      setStudents(students);
    } catch (err) {
      setError(err.message || 'Failed to process Excel file');
    } finally {
      setLoading(false);
    }
  }, [parseExcelFile, setStudents, setLoading, setError]);

  return (
    <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full h-[calc(70vh-4rem)] overflow-y-auto mt-0">
      <div className="text-center mb-6 md:mb-8">
        <div className="text-5xl md:text-6xl mb-4 md:mb-6">📊</div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">Upload Student Data</h2>
        <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto">
          Upload an Excel file with student information to generate an interactive 3D visualization
        </p>
      </div>

      <FileDropZone
        onFileSelect={handleFileUpload}
        accept=".xlsx,.xls"
        loading={loading}
      />

      {error && (
        <div className="mt-4 md:mt-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg md:rounded-xl text-red-700 text-sm">
          <div className="flex items-center">
            <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Error</span>
          </div>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {/* Updated Sample Data Format - Removed bench_id */}
      <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg md:rounded-xl border border-blue-200">
        <h4 className="font-bold text-blue-800 mb-3 md:mb-4 text-lg">Expected Excel Format</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-xs md:text-sm">1</span>
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-800 text-sm">reg_no</div>
                <div className="text-gray-600 text-xs">Student registration number</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-xs md:text-sm">2</span>
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-800 text-sm">name</div>
                <div className="text-gray-600 text-xs">Student full name</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-xs md:text-sm">3</span>
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-800 text-sm">dept</div>
                <div className="text-gray-600 text-xs">Department (CSE, ECE, etc.)</div>
              </div>
            </div>
          </div>
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-xs md:text-sm">4</span>
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-800 text-sm">sem</div>
                <div className="text-gray-600 text-xs">Semester number (1-8)</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-xs md:text-sm">5</span>
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-800 text-sm">subject</div>
                <div className="text-gray-600 text-xs">Subject name/code</div>
              </div>
            </div>
            {/* REMOVED: bench_id from the sample data format */}
          </div>
        </div>
        
        {/* Added note about bench_id for future use */}
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-700">
            <strong>Note:</strong> Bench allocation features will be added in the next phase of development.
            For now, focus on visualizing student data by department, semester, and subject.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExcelUploader;