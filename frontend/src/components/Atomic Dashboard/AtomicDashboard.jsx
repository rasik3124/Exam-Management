import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExamDayController from './ExamDayController';
import StudentStream from './StudentStream';
import ActiveDayAnalysis from './ActiveDayAnalysis';
import CommandCenter from './CommandCenter';
import { useAtomicDashboard } from '../../hooks/useAtomicDashboard';
import { useParams } from 'react-router-dom';

const AtomicDashboard = () => {
  const { examId } = useParams();
  const [selectedDayId, setSelectedDayId] = useState('day1');
  const {
    examData,
    students,
    validation,
    capacity,
    rooms,
    isLoading,
    updateValidation,
    refreshData,
    resolveIssue,
    triggerAllocation
  } = useAtomicDashboard({ examId, selectedDayId });

  const needsStudents = students.length === 0;
  const needsDays = !examData?.days?.length;
  const showSetup = needsStudents || needsDays;


  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading exam environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* SETUP REQUIRED OVERLAY */}
      <AnimatePresence>
        {showSetup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-xl p-8"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                  ⚠️ Setup Required
                </h2>
                <p className="text-slate-600 mt-2">
                  Upload required information before starting seat allocation.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* STUDENT UPLOAD */}
                <div
                  className={`border rounded-xl p-4 text-center transition ${
                    needsStudents
                      ? "border-blue-500 bg-blue-50 hover:shadow-md cursor-pointer"
                      : "border-emerald-300 bg-emerald-50 opacity-70"
                  }`}
                >
                  <div className="text-4xl mb-3">
                    {needsStudents ? "🎓" : "✅"}
                  </div>
                  <h3 className="font-semibold text-slate-900">
                    Student Data
                  </h3>
                  <p className="text-xs text-slate-600 mb-3">
                    Registration no, dept, subjects
                  </p>

                  {needsStudents ? (
                    <button
                      onClick={() => window.location.href = `/student-upload/${examId}`}
                      className="w-full bg-blue-600 text-slate-700 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                      Upload Students
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-semibold text-sm">
                      Uploaded ✅
                    </span>
                  )}
                </div>

                {/* TIMETABLE UPLOAD */}
                <div
                  className={`border rounded-xl p-4 text-center transition ${
                    needsDays
                      ? "border-indigo-500 bg-indigo-50 hover:shadow-md cursor-pointer"
                      : "border-emerald-300 bg-emerald-50 opacity-70"
                  }`}
                >
                  <div className="text-4xl mb-3">
                    {needsDays ? "📅" : "✅"}
                  </div>
                  <h3 className="font-semibold text-slate-900">
                    Timetable
                  </h3>
                  <p className="text-xs text-slate-600 mb-3">
                    Date, session, subjects
                  </p>

                  {needsDays ? (
                    <button
                      onClick={() => window.location.href = `/timetable-upload/${examId}`}
                      className="w-full bg-indigo-600 text-slate-700 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
                    >
                      Upload Timetable
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-semibold text-sm">
                      Uploaded ✅
                    </span>
                  )}
                </div>

              </div>

              {/* Footer */}
              <div className="mt-6 text-center text-xs text-slate-500">
                🚀 Once both are ready, dashboard unlocks automatically.
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar - Exam Day Controller */}
      <ExamDayController
        exam={examData}
        rooms={rooms} 
        selectedDayId={selectedDayId}
        onDayChange={setSelectedDayId}
        validation={validation}
        updateValidation={updateValidation}
      />

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Left Panel - Student Stream */}
        <div className="w-1/3 border-r border-slate-200">
          <StudentStream
            students={students}
            exam={examData}
            onStudentAction={resolveIssue}
            selectedDayId={selectedDayId}
          />
        </div>

        {/* Right Panel - Active Day Analysis */}
        <div className="w-2/3">
          <ActiveDayAnalysis
            exam={examData}
            students={students}
            validation={validation}
            capacity={capacity}
            selectedDayId={selectedDayId}
          />
        </div>
      </div>

      {/* Bottom Bar - Command Center */}
      <CommandCenter
        validation={validation}
        capacity={capacity}
        onProceed={triggerAllocation}
        onExportReport={() => console.log('Export report')}
        onDryRun={() => console.log('Dry run')}
      />
    </div>
  );
};

export default AtomicDashboard;