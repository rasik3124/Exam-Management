// components/upload/StudentUpload.jsx
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { parseExcelFile, detectColumnTypes } from '../engines/excelParser';
import { useExamStore } from '../../../Stores/useExamStore';
import HeaderMapper from './HeaderMapper';
import ValidationSummary from './ValidationSummary';
import ErrorBin from './ErrorBin';
import { useNavigate, useParams } from 'react-router-dom';

const StudentUpload = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [uploadStage, setUploadStage] = useState('upload'); // 'upload' | 'mapping' | 'validation'
  const [fileData, setFileData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const setRawStudentData = useExamStore(state => state.setRawStudentData);
  const rawStudents = useExamStore(state => state.studentDataByExam?.[examId]);
  const studentData = Array.isArray(rawStudents) ? rawStudents : [];
  const rawErrors = useExamStore(state => state.errorBinByExam?.[examId]);
  const errorBin = Array.isArray(rawErrors) ? rawErrors : []; 

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    setIsProcessing(true);
    try {
      const file = acceptedFiles[0];
      const { headers, rows } = await parseExcelFile(file);
      console.log("✅ RAW HEADERS:", headers);
      console.log("✅ RAW FIRST ROW:", rows[0]);
      console.log("✅ RAW TOTAL ROWS:", rows.length);
      setFileData({ headers, rows, fileName: file.name });
      setUploadStage('mapping');
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Error reading file. Please make sure it\'s a valid Excel file.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false
  });

  const handleHeaderMapping = (mapping) => {
    setIsProcessing(true);
    
  const mappedData = fileData.rows.map(row => {
    const mappedRow = {};

    Object.entries(mapping).forEach(([field, columnIndex]) => {

      // ✅ SUBJECT IS ARRAY OF COLUMNS
      if (field === "SUBJECT") {
        mappedRow.SUBJECT = columnIndex
          .map(i => row[i])
          .filter(Boolean);         // remove empty cells
        return;
      }

      // ✅ NORMAL FIELDS
      if (columnIndex !== null && row[columnIndex] !== undefined) {
        mappedRow[field] = row[columnIndex];
      }

    });

    console.log("✅ FINAL STUDENT ROW:", mappedRow);
    return mappedRow;
  });



    setRawStudentData(examId, mappedData, fileData.headers);
    setUploadStage('validation');
    setIsProcessing(false);
  };

  const handleContinue = () => {
    // Move to next step in the workflow
    console.log('Continue to next step');
    navigate(`/atomicdash/${examId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Student Data Upload
          </h1>
          <p className="text-slate-600">
            Upload your student Excel file with registration numbers, departments, and subjects
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Upload Progress */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8">
              <h2 className="font-semibold text-slate-900 mb-4">Upload Progress</h2>
              
              <div className="space-y-2">
                {[
                  { stage: 'upload', label: 'File Upload', status: uploadStage },
                  { stage: 'mapping', label: 'Column Mapping', status: uploadStage },
                  { stage: 'validation', label: 'Data Validation', status: uploadStage }
                ].map((step, index) => (
                  <div key={step.stage} className="flex items-center space-x-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${uploadStage === step.stage ? 'bg-blue-600 text-slate-700 ' : 
                        index < ['upload', 'mapping', 'validation'].indexOf(uploadStage) ? 
                        'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}
                    `}>
                      {index + 1}
                    </div>
                    <span className={`
                      text-sm font-medium
                      ${uploadStage === step.stage ? 'text-blue-600' : 
                        index < ['upload', 'mapping', 'validation'].indexOf(uploadStage) ? 
                        'text-emerald-600' : 'text-slate-500'}
                    `}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Stats */}
              {studentData.length > 0 && (
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-medium text-slate-900 text-sm mb-2">Upload Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Students:</span>
                      <span className="font-medium text-slate-900">{studentData.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Errors:</span>
                      <span className="font-medium text-rose-600">
                        {errorBin.filter(e => e.severity === 'error').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Warnings:</span>
                      <span className="font-medium text-amber-600">
                        {errorBin.filter(e => e.severity === 'warning').length}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {uploadStage === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div
                    {...getRootProps()}
                    className={`
                      border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
                      ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400'}
                      ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <input {...getInputProps()} />
                    
                    {isProcessing ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-slate-600">Processing file...</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          Upload Student Excel File
                        </h3>
                        <p className="text-slate-600 mb-4">
                          Drag and drop your Excel file here, or click to browse
                        </p>
                        <p className="text-sm text-slate-500">
                          Supports .xlsx, .xls, and .csv formats
                        </p>
                      </>
                    )}
                  </div>

                  {/* Format Guide */}
                  <div className="mt-8 bg-blue-50 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Expected Format</h4>
                    <div className="text-sm text-blue-800 space-y-2">
                      <p>• One row per student</p>
                      <p>• Required: Registration Number, Semester, Department</p>
                      <p>• Multiple subject columns allowed</p>
                      <p>• Column headers will be automatically detected</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {uploadStage === 'mapping' && fileData && (
                <motion.div
                  key="mapping"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <HeaderMapper
                    headers={fileData.headers}
                    rows={fileData.rows.slice(0, 10)} // Preview first 10 rows
                    onMappingComplete={handleHeaderMapping}
                    fileType="student"
                  />
                </motion.div>
              )}

              {uploadStage === 'validation' && (
                <motion.div
                  key="validation"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <ValidationSummary
                    errors={errorBin}
                    selectedDay={null}   // upload screens don't have day context
                  />
                  
                  {errorBin.length > 0 && (
                    <ErrorBin errors={errorBin} />
                  )}

                  <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
                    {/* ⬇️ This button is now for Timetable Details Upload */}
                    <button
                      onClick={handleContinue}
                      className="px-6 py-2 bg-blue-600 text-slate-700 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Proceed to Atomic Dashboard
                    </button>

                    {/* ⬇️ Optional: keep re-upload button on the right (or remove if you don't want) */}
                    <button
                      onClick={() => setUploadStage('upload')}
                      className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Re-upload Student File
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentUpload;