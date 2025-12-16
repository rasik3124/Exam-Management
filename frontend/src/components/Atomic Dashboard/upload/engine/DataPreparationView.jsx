// components/engine/DataPreparationView.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExamStore } from '../../store/useExamStore';
import SmartSubjectEngine from './SmartSubjectEngine';
import AtomicReadinessGate from '../atomic/AtomicReadinessGate';

const DataPreparationView = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [preparedData, setPreparedData] = useState(null);
  
  const rawStudents = useExamStore(state => state.studentDataByExam?.[examId]);
  const studentData = Array.isArray(rawStudents) ? rawStudents : [];
  const rawTimetable = useExamStore(state => state.timetableDataByExam?.[examId]);
  const timetableData = Array.isArray(rawTimetable) ? rawTimetable : [];
  const subjectMappings = useExamStore(state => state.subjectMappings);
  const rawErrors = useExamStore(state => state.errorBinByExam?.[examId]);
  const errorBin = Array.isArray(rawErrors) ? rawErrors : [];
  const prepareAtomicDataset = useExamStore(state => state.prepareAtomicDataset);
  const getValidationStatus = useExamStore(state => state.getValidationStatus);

  useEffect(() => {
    if (studentData.length > 0 && timetableData.length > 0) {
      const dataset = prepareAtomicDataset();
      setPreparedData(dataset);
    }
  }, [studentData, timetableData, subjectMappings, prepareAtomicDataset]);

  const validationStatus = getValidationStatus();
  const hasBlockingErrors = validationStatus.issues.some(issue => issue.severity === 'error');
  const unresolvedErrors = errorBin.filter(error => !error.resolved);

  const tabs = [
    { id: 'overview', label: 'Data Overview', icon: '📊' },
    { id: 'subjects', label: 'Subject Resolution', icon: '🔍' },
    { id: 'validation', label: 'Validation', icon: '✅' },
    { id: 'readiness', label: 'System Readiness', icon: '🚀' }
  ];

  const getDayStats = (day) => {
    const subjectCount = day.subjects.length;
    const studentCount = day.students.length;
    const uniqueSemesters = [...new Set(day.subjects.map(s => s.semester))].length;
    
    return { subjectCount, studentCount, uniqueSemesters };
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Data Preparation Center
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Review and prepare your data for the atomic allocation system. 
            Ensure all conflicts are resolved before proceeding to seat allocation.
          </p>
        </div>

        {/* Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-6 mb-8 ${
            hasBlockingErrors
              ? 'bg-rose-50 border border-rose-200'
              : unresolvedErrors.length > 0
              ? 'bg-amber-50 border border-amber-200'
              : 'bg-emerald-50 border border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`text-2xl ${
                hasBlockingErrors ? 'text-rose-600' : 
                unresolvedErrors.length > 0 ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {hasBlockingErrors ? '❌' : unresolvedErrors.length > 0 ? '⚠️' : '✅'}
              </div>
              <div>
                <h3 className={`font-semibold ${
                  hasBlockingErrors ? 'text-rose-900' : 
                  unresolvedErrors.length > 0 ? 'text-amber-900' : 'text-emerald-900'
                }`}>
                  {hasBlockingErrors 
                    ? 'Critical Issues Blocking Allocation' 
                    : unresolvedErrors.length > 0
                    ? 'Review Recommended Before Allocation'
                    : 'Data Ready for Allocation'
                  }
                </h3>
                <p className={`text-sm ${
                  hasBlockingErrors ? 'text-rose-700' : 
                  unresolvedErrors.length > 0 ? 'text-amber-700' : 'text-emerald-700'
                }`}>
                  {hasBlockingErrors
                    ? `${validationStatus.issues.length} critical issues must be resolved`
                    : unresolvedErrors.length > 0
                    ? `${unresolvedErrors.length} issues to review`
                    : 'All validation checks passed successfully'
                  }
                </p>
              </div>
            </div>
            
            {!hasBlockingErrors && (
              <AtomicReadinessGate examId="current-exam" forceShow={false}>
                <button className="px-6 py-3 bg-blue-600 text-slate-700 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                  Enter Atomic Dashboard
                </button>
              </AtomicReadinessGate>
            )}
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="flex border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && preparedData && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {preparedData.studentCount}
                      </div>
                      <div className="text-sm text-blue-800 font-medium">Total Students</div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                      <div className="text-2xl font-bold text-emerald-600 mb-2">
                        {preparedData.days.length}
                      </div>
                      <div className="text-sm text-emerald-800 font-medium">Exam Days</div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                      <div className="text-2xl font-bold text-amber-600 mb-2">
                        {Object.keys(subjectMappings).length}
                      </div>
                      <div className="text-sm text-amber-800 font-medium">Subject Mappings</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">
                        {preparedData.days.reduce((acc, day) => acc + day.subjects.length, 0)}
                      </div>
                      <div className="text-sm text-purple-800 font-medium">Total Sessions</div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-slate-900 text-lg mb-4">Exam Day Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {preparedData.days.map((day, index) => {
                      const stats = getDayStats(day);
                      return (
                        <motion.div
                          key={day.date}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-slate-200 rounded-xl p-6 bg-white hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-slate-900">
                              {new Date(day.date).toLocaleDateString()}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              day.session === 'FN' 
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {day.session}
                            </span>
                          </div>
                          
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Students:</span>
                              <span className="font-semibold text-slate-900">{stats.studentCount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Subjects:</span>
                              <span className="font-semibold text-slate-900">{stats.subjectCount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Semesters:</span>
                              <span className="font-semibold text-slate-900">{stats.uniqueSemesters}</span>
                            </div>
                          </div>

                          {/* Subject List */}
                          <div className="mt-4 pt-4 border-t border-slate-200">
                            <h5 className="text-xs font-medium text-slate-500 mb-2">Subjects:</h5>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {day.subjects.slice(0, 5).map((subject, idx) => (
                                <div key={idx} className="flex justify-between text-xs">
                                  <span className="text-slate-700  truncate">{subject.code}</span>
                                  <span className="text-slate-500">{subject.count} students</span>
                                </div>
                              ))}
                              {day.subjects.length > 5 && (
                                <div className="text-xs text-slate-500 text-center">
                                  +{day.subjects.length - 5} more subjects
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === 'subjects' && (
                <motion.div
                  key="subjects"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <SmartSubjectEngine />
                </motion.div>
              )}

              {activeTab === 'validation' && (
                <motion.div
                  key="validation"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Student Data Validation */}
                    <div className="border border-slate-200 rounded-xl p-6 bg-white">
                      <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Student Data
                      </h3>
                      <div className="space-y-3">
                        {[
                          { label: 'Total Students', value: studentData.length, status: 'info' },
                          { label: 'With Registration', value: studentData.filter(s => s.registrationNumber).length, status: studentData.filter(s => s.registrationNumber).length === studentData.length ? 'success' : 'error' },
                          { label: 'With Semester', value: studentData.filter(s => s.semester).length, status: studentData.filter(s => s.semester).length === studentData.length ? 'success' : 'error' },
                          { label: 'With Subjects', value: studentData.filter(s => s.subjects.length > 0).length, status: studentData.filter(s => s.subjects.length > 0).length === studentData.length ? 'success' : 'warning' },
                        ].map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-slate-700 ">{item.label}</span>
                            <span className={`text-sm font-medium ${
                              item.status === 'success' ? 'text-emerald-600' :
                              item.status === 'error' ? 'text-rose-600' :
                              item.status === 'warning' ? 'text-amber-600' : 'text-slate-600'
                            }`}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timetable Data Validation */}
                    <div className="border border-slate-200 rounded-xl p-6 bg-white">
                      <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Timetable Data
                      </h3>
                      <div className="space-y-3">
                        {[
                          { label: 'Total Sessions', value: timetableData.length, status: 'info' },
                          { label: 'With Dates', value: timetableData.filter(t => t.examDate).length, status: timetableData.filter(t => t.examDate).length === timetableData.length ? 'success' : 'error' },
                          { label: 'With Sessions', value: timetableData.filter(t => t.session).length, status: timetableData.filter(t => t.session).length === timetableData.length ? 'success' : 'error' },
                          { label: 'With Subject Codes', value: timetableData.filter(t => t.subjectCode).length, status: timetableData.filter(t => t.subjectCode).length === timetableData.length ? 'success' : 'error' },
                        ].map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-slate-700 ">{item.label}</span>
                            <span className={`text-sm font-medium ${
                              item.status === 'success' ? 'text-emerald-600' :
                              item.status === 'error' ? 'text-rose-600' : 'text-slate-600'
                            }`}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Error Summary */}
                  {unresolvedErrors.length > 0 && (
                    <div className="border border-amber-200 rounded-xl p-6 bg-amber-50">
                      <h3 className="font-semibold text-amber-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Unresolved Issues
                      </h3>
                      <div className="space-y-2">
                        {unresolvedErrors.slice(0, 5).map((error, index) => (
                          <div key={error.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                            <div>
                              <span className="text-sm font-medium text-amber-900">{error.message}</span>
                              <span className="text-xs text-amber-700 ml-2">(Row {error.row})</span>
                            </div>
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                              {error.type?.replace(/_/g, ' ')}
                            </span>
                          </div>
                        ))}
                        {unresolvedErrors.length > 5 && (
                          <div className="text-center text-sm text-amber-700">
                            +{unresolvedErrors.length - 5} more issues to resolve
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'readiness' && (
                <motion.div
                  key="readiness"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <AtomicReadinessGate examId="current-exam" forceShow={true}>
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Ready for Atomic Dashboard
                      </h3>
                      <p className="text-slate-600 mb-6">
                        All data has been prepared and validated. You can now proceed to the allocation system.
                      </p>
                      <button className="px-8 py-3 bg-blue-600 text-slate-700 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                        Enter Atomic Dashboard
                      </button>
                    </div>
                  </AtomicReadinessGate>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPreparationView;