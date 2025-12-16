// components/atomic/AtomicReadinessGate.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExamStore } from '../../Stores/useExamStore';
import { useParams } from "react-router-dom";


const AtomicReadinessGate = ({ examId, children, forceShow = false }) => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [checks, setChecks] = useState([]);
  
  const getValidationStatusForExam = useExamStore(state => state.getValidationStatusForExam);
  const prepareAtomicDataset = useExamStore(state => state.prepareAtomicDataset);

  useEffect(() => {
    const storageKey = `atomicCheckSeen_${examId}`;
    const hasSeenCheck = localStorage.getItem(storageKey) === 'true';
    
    if (hasSeenCheck && !forceShow) {
      setShowOverlay(false);
      return;
    }

    // Run validation checks
    const status = getValidationStatusForExam();
    const validationChecks = [
      {
        id: 'student-data',
        label: 'Student data uploaded and validated',
        status: status.studentDataReady ? 'success' : 'error',
        details: status.studentDataReady ? `${status.studentDataReady} students loaded` : 'No student data found'
      },
      {
        id: 'timetable-data',
        label: 'Timetable data uploaded and validated',
        status: status.timetableDataReady ? 'success' : 'error',
        details: status.timetableDataReady ? 'Timetable schedule loaded' : 'No timetable data found'
      },
      {
        id: 'duplicate-check',
        label: 'No duplicate registration numbers',
        status: status.noDuplicateReg ? 'success' : 'error',
        details: status.noDuplicateReg ? 'All registrations unique' : 'Duplicate registrations found'
      },
      {
        id: 'subject-mapping',
        label: 'Subject names mapped and resolved',
        status: status.subjectMatch ? 'success' : 'warning',
        details: status.subjectMatch ? 'Subject conflicts resolved' : 'Subject mapping needed'
      },
      {
        id: 'timetable-consistency',
        label: 'Timetable consistency verified',
        status: status.timetableConsistency ? 'success' : 'error',
        details: status.timetableConsistency ? 'Timetable format valid' : 'Timetable issues found'
      },
      {
        id: 'day-slicing',
        label: 'Students assigned to exam days',
        status: status.studentDaySlicing ? 'success' : 'warning',
        details: status.studentDaySlicing ? 'Day-wise grouping ready' : 'Day assignment pending'
      },
      {
        id: 'seat-calculation',
        label: 'Seat requirements calculated',
        status: status.seatRequirementCount ? 'success' : 'warning',
        details: status.seatRequirementCount ? 'Capacity analysis ready' : 'Seat calculation needed'
      }
    ];

    setChecks(validationChecks);
  }, [examId, forceShow, getValidationStatusForExam]);

  const handleContinue = () => {
    const storageKey = `atomicCheckSeen_${examId}`;
    localStorage.setItem(storageKey, 'true');
    setShowOverlay(false);
  };

  const allChecksPassed = checks.every(check => 
    check.status === 'success' || check.status === 'warning'
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '⏳';
    }
  };

  if (!showOverlay) {
    return children;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 w-full max-w-2xl"
      >
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            System Readiness Check
          </h1>
          <p className="text-gray-600 mb-6">
            Verifying data integrity before entering allocation system
          </p>

          <div className="space-y-4 mb-6">
            {checks.map((check, index) => (
              <motion.div
                key={check.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getStatusIcon(check.status)}</span>
                  <div>
                    <div className="font-medium text-gray-900">{check.label}</div>
                    <div className="text-sm text-gray-500">{check.details}</div>
                  </div>
                </div>
                
                {check.status === 'error' && (
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Fix
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowOverlay(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={handleContinue}
              disabled={!allChecksPassed}
              className={`
                px-6 py-2 rounded-xl font-medium transition-colors
                ${allChecksPassed
                  ? 'bg-blue-600 text-slate-700  hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Enter Atomic Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AtomicReadinessGate;