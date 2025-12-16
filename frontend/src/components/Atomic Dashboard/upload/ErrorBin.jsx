// components/upload/ErrorBin.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExamStore } from '../../../Stores/useExamStore';

const ErrorBin = ({ errors }) => {
  const [expandedError, setExpandedError] = useState(null);
  const updateErrorInBin = useExamStore(state => state.updateErrorInBin);
  const removeFromErrorBin = useExamStore(state => state.removeFromErrorBin);

  const handleEdit = (errorId, newValue) => {
    updateErrorInBin(errorId, { resolved: true, correctedValue: newValue });
  };

  const handleDelete = (errorId) => {
    removeFromErrorBin(errorId);
  };

  const handleApprove = (errorId) => {
    updateErrorInBin(errorId, { resolved: true, approved: true });
  };

  const errorGroups = errors.reduce((groups, error) => {
    const type = error.type;
    if (!groups[type]) groups[type] = [];
    groups[type].push(error);
    return groups;
  }, {});

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 flex items-center">
              <svg className="w-5 h-5 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Data Issues
            </h2>
            <p className="text-slate-600 mt-1">
              Review and resolve data issues before proceeding
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-rose-600">
              {errors.filter(e => !e.resolved).length}
            </div>
            <div className="text-sm text-slate-500">Unresolved Issues</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence>
          {Object.entries(errorGroups).map(([type, typeErrors]) => (
            <motion.div
              key={type}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 last:mb-0"
            >
              <h3 className="font-medium text-slate-900 mb-3 capitalize">
                {type.replace(/_/g, ' ')} ({typeErrors.length})
              </h3>
              
              <div className="space-y-3">
                {typeErrors.map((error) => (
                  <motion.div
                    key={`${error.id}-${error.row}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg border ${
                      error.resolved
                        ? 'bg-emerald-50 border-emerald-200'
                        : error.severity === 'error'
                        ? 'bg-rose-50 border-rose-200'
                        : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`
                            text-sm font-medium px-2 py-1 rounded
                            ${error.resolved
                              ? 'bg-emerald-100 text-emerald-800'
                              : error.severity === 'error'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                            }
                          `}>
                            Row {error.row}
                          </span>
                          <span className="text-sm text-slate-600">
                            {error.column}
                          </span>
                          {error.resolved && (
                            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                              Resolved
                            </span>
                          )}
                        </div>
                        
                        <p className="text-slate-900 font-medium mb-1">
                          {error.message}
                        </p>
                        
                        {error.value && (
                          <p className="text-sm text-slate-600">
                            Current value: <code className="bg-slate-100 px-1 rounded">{error.value}</code>
                          </p>
                        )}
                      </div>

                      {!error.resolved && (
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => setExpandedError(expandedError === error.id ? null : error.id)}
                            className="px-3 py-1 border border-slate-300 text-slate-700  rounded text-sm hover:bg-slate-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleApprove(error.id)}
                            className="px-3 py-1 bg-amber-500 text-slate-700  rounded text-sm hover:bg-amber-600 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleDelete(error.id)}
                            className="px-3 py-1 bg-slate-200 text-slate-700  rounded text-sm hover:bg-slate-300 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Edit Form */}
                    <AnimatePresence>
                      {expandedError === error.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-slate-200"
                        >
                          <div className="flex space-x-3">
                            <input
                              type="text"
                              placeholder="Enter corrected value..."
                              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleEdit(error.id, e.target.value);
                                  setExpandedError(null);
                                }
                              }}
                            />
                            <button
                              onClick={() => {
                                const input = document.querySelector('input[type="text"]');
                                handleEdit(error.id, input.value);
                                setExpandedError(null);
                              }}
                              className="px-4 py-2 bg-blue-600 text-slate-700  rounded-lg text-sm hover:bg-blue-700 transition-colors"
                            >
                              Save
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {errors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No Issues Found
            </h3>
            <p className="text-slate-600">
              All data has been validated and is ready for processing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorBin;