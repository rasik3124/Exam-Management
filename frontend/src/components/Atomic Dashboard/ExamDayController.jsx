import { useExamStore } from "../../Stores/useExamStore"
import { useState } from 'react';
import { motion } from 'framer-motion';
import DayTabs from './DayTabs';
import { useParams, useNavigate } from "react-router-dom";


const ExamDayController = ({ exam, rooms = [], selectedDayId, onDayChange, validation, updateValidation }) => {
  // Safety guards
  const { examId } = useParams();
  const navigate = useNavigate();
  const safeExam = exam || { days: [] };
  const [importOpen, setImportOpen] = useState(false);
  const currentDay =
    safeExam.days?.find(day => day.id === selectedDayId) || {
      rooms: [],
      studentCount: 0,
      totalCapacity: 0,
    };

  const getValidationStatusForExam = useExamStore(state => state.getValidationStatusForExam);
  const [systemCheckLoading, setSystemCheckLoading] = useState(false);

  const runSystemCheck = () => {
    setSystemCheckLoading(true);

    const report = getValidationStatusForExam(examId);

    updateValidation({
      hasBlockingErrors: report.issues.length > 0 || !report.studentDataReady || !report.timetableDataReady,
      hasWarnings:
        report.issues.length > 0 && !report.issues.some(e => e.severity === "error"),
      details: report
    });

    setTimeout(() => setSystemCheckLoading(false), 300);
  }
  
  const safeValidation = validation || {
    hasBlockingErrors: false,
    hasWarnings: false,
  };

  const getStatusColor = () => {
    if (safeValidation.hasBlockingErrors) return 'bg-rose-100 text-rose-800 border-rose-200';
    if (safeValidation.hasWarnings) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  const getStatusText = () => {
    if (safeValidation.hasBlockingErrors) return 'BLOCKED';
    if (safeValidation.hasWarnings) return 'REVIEW NEEDED';
    return 'READY';
  };

  const handleStudentImport = () => {
    navigate(`/student-upload/${examId}`)
  }

  const handleTimetableImport = () => {
    navigate(`/timetable-upload/${examId}`)
  }
  const roomsCount = rooms.length || 0;
  const studentCount = currentDay.studentCount || 0;
  const totalCapacity = currentDay.totalCapacity || 0;
  const available = currentDay.remainingCapacity ?? 0;
  const utilization = currentDay.utilizationPercent ?? 0;


  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      {/* Main Header Row */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {safeExam.title || 'Exam Day Controller'}
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Session: {safeExam.sessionCode || 'N/A'} • {safeExam.department || 'All Departments'}
          </p>
        </div>
        
        <div className="flex items-start space-x-4">

          {/* IMPORT DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setImportOpen(prev => !prev)}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg 
                        border border-slate-300 bg-white text-slate-700 
                        transition text-sm
                        hover:scale-105 active:scale-95"
            >
              <span>Import</span>
              <span
                className={`transition-transform duration-200 ${
                  importOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {importOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white 
                          border border-slate-200 rounded-lg 
                          shadow-md overflow-hidden z-50"
              >
                <button
                  onClick={() => {
                    setImportOpen(false);
                    handleStudentImport();
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition"
                >
                  🧑🏻‍🎓 Load Students
                </button>

                <button
                  onClick={() => {
                    setImportOpen(false);
                    handleTimetableImport();
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition"
                >
                  📅 Load Timetable
                </button>
              </div>
            )}
          </div>

          {/* SYSTEM CHECK */}
          <button
            onClick={runSystemCheck}
            disabled={systemCheckLoading}
            className={`px-3 py-1 rounded-lg text-sm font-medium
              border transition-all flex items-center gap-1
              ${
                systemCheckLoading
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-blue-600 text-slate-700 hover:bg-blue-700"
              }`}
          >
            {systemCheckLoading ? "Checking…" : "System Check"}
          </button>

          {/* STATUS BADGE */}
          <div className="text-right">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm 
                          font-medium border ${getStatusColor()}`}
            >
              <span className="w-2 h-2 rounded-full mr-2 bg-current opacity-70"></span>
              {getStatusText()}
            </div>
            <p className="text-xs text-slate-500 mt-1">System Status</p>
          </div>
        </div>
        </div>
      {/* Stats Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-6 text-sm">
          <div>
            <span className="text-slate-600">Rooms:</span>
            <span className="font-semibold text-slate-900 ml-2">{roomsCount}</span>
          </div>
          <div>
            <span className="text-slate-600">Students:</span>
            <span className="font-semibold text-slate-900 ml-2">{studentCount}</span>
          </div>
          <div>
            <span className="text-slate-600">Capacity:</span>
            <span className="font-semibold text-slate-900 ml-2">{totalCapacity}</span>
          </div>
          <div>
            <span className="text-slate-600">Available:</span>
            <span
              className={`font-semibold ml-2 ${
                available < 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {available}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
      <div>
        <span className="text-slate-600">Utilization:</span>
        <span className="font-semibold text-slate-900 ml-2">
          {utilization}%
        </span>
      </div>


      {/* Day Tabs */}
      <DayTabs
        days={safeExam.days || []}
        selectedDayId={selectedDayId}
        onSelectDay={onDayChange}
      />
    </div>
  );
};

export default ExamDayController;
