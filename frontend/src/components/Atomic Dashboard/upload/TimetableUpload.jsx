// components/upload/TimetableUpload.jsx
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { parseExcelFile, detectColumnTypes } from '../engines/excelParser';
import { useExamStore } from '../../../Stores/useExamStore';
import HeaderMapper from './HeaderMapper';
import ValidationSummary from './ValidationSummary';
import ErrorBin from './ErrorBin';
import { useParams, useNavigate } from 'react-router-dom';

const TimetableUpload = () => {
  const [uploadStage, setUploadStage] = useState('upload'); // 'upload' | 'mapping' | 'validation'
  const [fileData, setFileData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { examId } = useParams();
  const Navigate = useNavigate();
  
  const setRawTimetableData = useExamStore(state => state.setRawTimetableData);
  const rawTimetable = useExamStore(state => state.timetableDataByExam?.[examId]);
  const timetableData = Array.isArray(rawTimetable) ? rawTimetable : [];
  const rawErrors = useExamStore(state => state.errorBinByExam?.[examId]);
const errorBin = Array.isArray(rawErrors) ? rawErrors : [];
  const rawStudents = useExamStore(state => state.studentDataByExam?.[examId]);
  const studentData = Array.isArray(rawStudents) ? rawStudents : [];

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    setIsProcessing(true);
    try {
      const file = acceptedFiles[0];
      const { headers, rows } = await parseExcelFile(file);
      
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
    
    // Process the data with the mapping
    setRawTimetableData(examId, fileData.rows, mapping);
    setUploadStage('validation');
    setIsProcessing(false);
  };

  const handleContinue = () => {
    
    Navigate(`/atomicdash/${examId}`)
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Timetable Data Upload
          </h1>
          <p className="text-slate-600">
            Upload your exam timetable with dates, sessions, and subjects
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
              {timetableData.length > 0 && (
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-medium text-slate-900 text-sm mb-2">Upload Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Exam Sessions:</span>
                      <span className="font-medium text-slate-900">{timetableData.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Unique Subjects:</span>
                      <span className="font-medium text-slate-900">
                        {[...new Set(timetableData.map(t => t.subjectCode))].length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Exam Days:</span>
                      <span className="font-medium text-slate-900">
                        {[...new Set(timetableData.map(t => t.examDate))].length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Errors:</span>
                      <span className="font-medium text-rose-600">
                        {errorBin.filter(e => e.severity === 'error').length}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Student Data Status */}
              {studentData.length > 0 && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <h3 className="font-medium text-emerald-900 text-sm mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Student Data Ready
                  </h3>
                  <p className="text-emerald-800 text-xs">
                    {studentData.length} students loaded and validated
                  </p>
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          Upload Timetable Excel File
                        </h3>
                        <p className="text-slate-600 mb-4">
                          Drag and drop your timetable Excel file here, or click to browse
                        </p>
                        <p className="text-sm text-slate-500">
                          Supports .xlsx, .xls, and .csv formats
                        </p>
                      </>
                    )}
                  </div>

                  {/* Format Guide */}
                  <div className="mt-8 bg-blue-50 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Expected Timetable Format</h4>
                    <div className="text-sm text-blue-800 space-y-2">
                      <p>• One row per exam session</p>
                      <p>• Required: Exam Date, Session (FN/AN), Subject Code</p>
                      <p>• Optional: Subject Name, Semester</p>
                      <p>• Session will be normalized to FN (Morning) or AN (Afternoon)</p>
                    </div>
                    
                    {/* Sample Table */}
                    <div className="mt-4 bg-white rounded-lg p-4 border border-blue-200">
                      <h5 className="font-medium text-blue-900 text-sm mb-2">Sample Format:</h5>
                      <div className="text-xs font-mono bg-slate-50 p-3 rounded">
                        <div className="grid grid-cols-5 gap-2 font-semibold text-slate-900 border-b border-slate-200 pb-1 mb-1">
                          <div>Exam Date</div>
                          <div>Session</div>
                          <div>Subject Code</div>
                          <div>Subject Name</div>
                          <div>Semester</div>
                        </div>
                        <div className="grid grid-cols-5 gap-2 text-slate-600">
                          <div>2025-05-10</div>
                          <div>FN</div>
                          <div>CS401</div>
                          <div>Advanced Algorithms</div>
                          <div>4</div>
                        </div>
                      </div>
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
                    fileType="timetable"
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
                    selectedDay={null}  
                    errors={errorBin.filter(e => e.type?.includes('timetable') || e.row?.toString().includes('timetable'))}
                  />
                  
                  {errorBin.length > 0 && (
                    <ErrorBin errors={errorBin} />
                  )}

                  <div className="flex justify-between items-center pt-6 border-t border-slate-200">
                    <div className="text-sm text-slate-600">
                      {studentData.length > 0 ? (
                        <span className="text-emerald-600 font-medium">
                          ✓ Student data loaded ({studentData.length} students)
                        </span>
                      ) : (
                        <span className="text-amber-600">
                          ⚠ No student data uploaded yet
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setUploadStage('upload')}
                        className="px-6 py-2 border border-slate-300 text-slate-700  rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Upload Different File
                      </button>
                      <button
                        onClick={handleContinue}
                        className="px-6 py-2 bg-blue-600 text-slate-700  rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Proceed to Atomic Dashboard 
                      </button>
                    </div>
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

export default TimetableUpload;