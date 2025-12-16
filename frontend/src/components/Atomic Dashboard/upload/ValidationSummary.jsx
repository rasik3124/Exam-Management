// components/upload/ValidationSummary.jsx
import { motion } from 'framer-motion';
import { useExamStore } from '../../../Stores/useExamStore';
import { useParams } from 'react-router-dom';

  const ValidationSummary = ({ errors, selectedDay }) => {
  const { examId } = useParams();
  const rawStudents = useExamStore(state => state.studentDataByExam?.[examId]);
  const studentData = Array.isArray(rawStudents) ? rawStudents : [];
  const daySubjects = selectedDay?.subjects?.map(s => s.code) || [];

  const dayStudents = selectedDay
    ? studentData.filter(s =>
        (s.SUBJECT || s.subjects || []).some(sub => {
          const code = typeof sub === 'string' ? sub : sub.code;
          return daySubjects.includes(code);
        })
      )
    : studentData;

  const safeErrors = Array.isArray(errors) ? errors : [];
  const errorCount = safeErrors.filter(e => e.severity === 'error').length;
  const warningCount = safeErrors.filter(e => e.severity === 'warning').length;
  const resolvedCount = safeErrors.filter(e => e.resolved).length;

  const getErrorTypeCount = (type) => 
    safeErrors.filter(e => e.type === type && !e.resolved).length;

  const stats = [
    {
      label: 'Total Students',
      value: studentData.length,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Total Subjects',
      value: [...new Set(studentData.flatMap(s => s.subjects || []))].length,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      label: 'Critical Errors',
      value: errorCount,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200'
    },
    {
      label: 'Warnings',
      value: warningCount,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      label: 'Resolved Issues',
      value: resolvedCount,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    }
  ];

  const errorTypes = [
    { type: 'missing_registration', label: 'Missing Registration', count: getErrorTypeCount('missing_registration') },
    { type: 'duplicate_registration', label: 'Duplicate Registration', count: getErrorTypeCount('duplicate_registration') },
    { type: 'missing_semester', label: 'Missing Semester', count: getErrorTypeCount('missing_semester') },
    { type: 'missing_department', label: 'Missing Department', count: getErrorTypeCount('missing_department') },
    { type: 'no_subjects', label: 'No Subjects', count: getErrorTypeCount('no_subjects') },
    { type: 'missing_date', label: 'Missing Date', count: getErrorTypeCount('missing_date') },
    { type: 'missing_session', label: 'Missing Session', count: getErrorTypeCount('missing_session') },
    { type: 'missing_subject_code', label: 'Missing Subject Code', count: getErrorTypeCount('missing_subject_code') }
  ].filter(item => item.count > 0);

  const getStatusColor = () => {
    if (errorCount > 0) return 'text-rose-600 bg-rose-50 border-rose-200';
    if (warningCount > 0) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  };

  const getStatusText = () => {
    if (errorCount > 0) return 'Critical Issues Found';
    if (warningCount > 0) return 'Warnings Found';
    return 'All Data Valid';
  };

  const getStatusIcon = () => {
    if (errorCount > 0) return '❌';
    if (warningCount > 0) return '⚠️';
    return '✅';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Validation Summary</h2>
            <p className="text-slate-600 mt-1">
              Overview of data quality and issues found during validation
            </p>
          </div>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${getStatusColor()}`}>
            <span className="text-lg">{getStatusIcon()}</span>
            <span className="font-medium">{getStatusText()}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6 border-b border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`text-center p-4 rounded-lg border ${stat.bgColor} ${stat.borderColor}`}
            >
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-slate-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Error Type Breakdown */}
      {errorTypes.length > 0 && (
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-medium text-slate-900 mb-4">Issue Breakdown</h3>
          <div className="space-y-3">
            {errorTypes.map((errorType, index) => (
              <motion.div
                key={errorType.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <span className="text-sm text-slate-700 ">{errorType.label}</span>
                <span className="text-sm font-medium text-rose-600 bg-rose-100 px-2 py-1 rounded">
                  {errorType.count} issue{errorType.count !== 1 ? 's' : ''}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Department Distribution */}
      {studentData.length > 0 && (
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-medium text-slate-900 mb-4">Department Distribution</h3>
          <div className="space-y-2">
            {Object.entries(
              studentData.reduce((acc, student) => {
                const dept = student.DEPARTMENT || 'Unknown';
                acc[dept] = (acc[dept] || 0) + 1;
                return acc;
              }, {})
            )
              .sort(([, a], [, b]) => b - a)
              .map(([dept, count], index) => (
                <motion.div
                  key={dept}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '100%' }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-slate-600 flex-1">{dept}</span>
                  <div className="flex items-center space-x-3 w-32">
                    <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / studentData.length) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-blue-500 h-2 rounded-full"
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-900 w-8 text-right">
                      {count}
                    </span>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Semester Distribution */}
      {dayStudents.length > 0 && (
        <div className="p-6 border-t border-slate-200">
          <h3 className="font-medium text-slate-900 mb-4">
            Semester Distribution {selectedDay && `( ${selectedDay.label} )`}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(sem => {
              const count = dayStudents.filter(
                s => Number(s.SEMESTER || s.semester) === sem
              ).length;

              if (!count) return null;

              return (
                <motion.div
                  key={sem}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="text-lg font-bold text-slate-900">
                    {count}
                  </div>
                  <div className="text-sm text-slate-600">
                    Semester {sem}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/*DAY-WISE CAPACITY ANALYSIS */}
      {selectedDay && (
        <div className="p-6 border-t border-slate-200">
          <h3 className="font-medium text-slate-900 mb-4">
            Capacity Analysis
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Total Capacity</span>
              <span className="font-semibold">
                {selectedDay.totalCapacity}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Students Scheduled</span>
              <span className="font-semibold">
                {selectedDay.studentCount}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Available Seats</span>
              <span className={`font-semibold ${
                selectedDay.totalCapacity - selectedDay.studentCount < 0
                  ? 'text-rose-600'
                  : 'text-emerald-600'
              }`}>
                {selectedDay.totalCapacity - selectedDay.studentCount}
              </span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${
                  selectedDay.studentCount > selectedDay.totalCapacity
                    ? 'bg-rose-500'
                    : 'bg-blue-500'
                }`}
                style={{
                  width: `${Math.min(
                    (selectedDay.studentCount / selectedDay.totalCapacity) * 100,
                    100
                  )}%`
                }}
              />
            </div>
          </div>
        </div>
      )}


      {/* Empty State */}
      {studentData.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No Data Processed
          </h3>
          <p className="text-slate-600">
            Upload and map your Excel file to see validation results.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ValidationSummary;