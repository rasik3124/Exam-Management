import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import DayTabs from './DayTabs';
import { useSystemChecks } from './useSystemChecks';

const SystemCheckOverlay = ({ examId, onContinue, onRequestFixIssues }) => {
  const [selectedDayId, setSelectedDayId] = useState('day1');
  const [showForceContinueConfirm, setShowForceContinueConfirm] = useState(false);
  
  const { status, checks, hasBlockingErrors, hasWarnings } = useSystemChecks({
    examId,
    selectedDayId
  });

  // Sample days data - in real app this would come from props
  const days = [
    { id: 'day1', label: 'Day 1', date: '2025-05-10' },
    { id: 'day2', label: 'Day 2', date: '2025-05-12' },
    { id: 'day3', label: 'Day 3', date: '2025-05-14' }
  ];

  const completedChecks = checks.filter(check => 
    check.status === 'success' || check.status === 'warning' || check.status === 'error'
  ).length;
  const totalChecks = checks.length;
  const progress = (completedChecks / totalChecks) * 100;

  const hasIssues = hasBlockingErrors || hasWarnings;
  const issues = checks.filter(check => check.status === 'error' || check.status === 'warning');

  // Handle ESC key for closing overlay (non-blocking only)
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27 && !hasBlockingErrors) {
        onContinue();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [hasBlockingErrors, onContinue]);

  const getStatusIcon = (check) => {
    switch (check.status) {
      case 'success':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
          >
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        );
      
      case 'running':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
          />
        );
      
      case 'error':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
          >
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.div>
        );
      
      case 'warning':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center"
          >
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </motion.div>
        );
      
      default:
        return (
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-500 rounded-full opacity-60" />
          </div>
        );
    }
  };

  const getStatusColor = (check) => {
    switch (check.status) {
      case 'success': return 'text-emerald-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-amber-600';
      case 'running': return 'text-blue-600';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      {/* Force Continue Confirmation Modal */}
      <AnimatePresence>
        {showForceContinueConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Continue with Issues?
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                You are continuing despite unresolved issues. Seat accuracy and allocation reliability are not guaranteed.
              </p>
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={() => setShowForceContinueConfirm(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onContinue}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Force Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Overlay Panel */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 w-full max-w-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Preparing Your Exam Environment
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {status === 'running' 
                  ? 'Verifying student data and configuration…' 
                  : status === 'success'
                  ? 'All systems ready for allocation'
                  : 'Review required issues before proceeding'
                }
              </p>
            </div>
            
            <div className="ml-6">
              <DayTabs
                days={days}
                selectedDayId={selectedDayId}
                onSelectDay={setSelectedDayId}
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>System Checks</span>
              <span>{completedChecks}/{totalChecks} completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className={`h-2 rounded-full ${
                  hasBlockingErrors ? 'bg-red-500' : hasWarnings ? 'bg-amber-500' : 'bg-gradient-to-r from-blue-500 to-emerald-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-h-96 overflow-y-auto p-6">
          {/* Checklist */}
          <motion.ul className="space-y-4">
            {checks.map((check, index) => (
              <motion.li
                key={check.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(check)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${getStatusColor(check)}`}>
                      {check.label}
                    </span>
                  </div>
                  
                  {check.description && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {check.description}
                    </p>
                  )}
                  
                  {check.details && (
                    <p className={`text-xs mt-1 ${
                      check.status === 'error' ? 'text-red-600' : 
                      check.status === 'warning' ? 'text-amber-600' : 'text-gray-600'
                    }`}>
                      {check.details}
                    </p>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ul>

          {/* Issues Summary */}
          <AnimatePresence>
            {hasIssues && status !== 'running' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6"
              >
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 0.6 }}
                  className="bg-amber-50 border border-amber-200 rounded-xl p-4"
                >
                  <h4 className="text-sm font-semibold text-amber-900 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Some issues need your attention
                  </h4>
                  
                  <div className="space-y-2">
                    {issues.map((issue) => (
                      <div
                        key={issue.id}
                        className={`text-xs p-2 rounded-lg ${
                          issue.status === 'error' 
                            ? 'bg-red-50 text-red-800 border border-red-100' 
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {issue.details}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200/50 flex justify-end space-x-3">
          {hasBlockingErrors && (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRequestFixIssues}
                className="bg-amber-500 hover:bg-amber-600 text-slate-700 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
              >
                Review & Fix
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForceContinueConfirm(true)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
              >
                Force Continue
              </motion.button>
            </>
          )}
          
          {!hasBlockingErrors && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onContinue}
              disabled={status === 'running'}
              className={`rounded-xl px-6 py-2 text-sm font-medium transition-colors ${
                status === 'running'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {status === 'running' ? 'Running Checks...' : 'Enter Dashboard'}
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SystemCheckOverlay;