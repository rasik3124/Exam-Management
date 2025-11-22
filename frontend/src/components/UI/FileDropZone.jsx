// src/components/UI/FileDropZone.jsx
import React, { useCallback, useState } from 'react';

const FileDropZone = ({ onFileSelect, accept, loading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
        isDragging
          ? 'border-blue-400 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => !loading && document.getElementById('file-input').click()}
    >
      <input
        id="file-input"
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
        disabled={loading}
      />
      
      <div className="text-4xl mb-4">📤</div>
      
      {loading ? (
        <div className="space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Processing file...</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-gray-700 font-medium">
            Drop your Excel file here or click to browse
          </p>
          <p className="text-sm text-gray-500">
            Supports .xlsx and .xls files
          </p>
        </div>
      )}
    </div>
  );
};

export default FileDropZone;