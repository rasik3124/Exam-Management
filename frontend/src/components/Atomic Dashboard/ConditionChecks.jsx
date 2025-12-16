import { motion, AnimatePresence } from 'framer-motion';

const ConditionChecks = ({ validation }) => {
  const checks = [
    {
      id: 'students-assigned',
      label: 'All students assigned to rooms',
      status: validation.allStudentsAssigned ? 'success' : 'error',
      message: validation.allStudentsAssigned ? '' : 'Some students lack room assignments'
    },
    {
      id: 'no-duplicates',
      label: 'No duplicate registrations',
      status: validation.noDuplicates ? 'success' : 'error',
      message: validation.noDuplicates ? '' : 'Duplicate registration numbers detected'
    },
    {
      id: 'subjects-covered',
      label: 'All subjects covered',
      status: validation.allSubjectsCovered ? 'success' : 'warning',
      message: validation.allSubjectsCovered ? '' : 'Some subjects have low enrollment'
    },
    {
      id: 'no-overlaps',
      label: 'No student overlapping exams',
      status: validation.noOverlaps ? 'success' : 'error',
      message: validation.noOverlaps ? '' : 'Exam timing overlaps detected'
    },
    {
      id: 'capacity-sufficient',
      label: 'Capacity sufficient',
      status: validation.capacitySufficient ? 'success' : 'error',
      message: validation.capacitySufficient ? '' : 'Insufficient seating capacity'
    },
    {
      id: 'no-empty-rooms',
      label: 'No unused rooms with empty seats',
      status: validation.noEmptyRooms ? 'success' : 'warning',
      message: validation.noEmptyRooms ? '' : 'Room optimization needed'
    },
    {
      id: 'language-separated',
      label: 'Language groups properly separated',
      status: validation.languageSeparated ? 'success' : 'warning',
      message: validation.languageSeparated ? '' : 'Language mixing detected'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '⏳';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-emerald-600';
      case 'error': return 'text-rose-600';
      case 'warning': return 'text-amber-600';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
        System Validation
      </h3>

      <div className="space-y-3">
        <AnimatePresence>
          {checks.map((check, index) => (
            <motion.div
              key={check.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                check.status === 'success' 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : check.status === 'error'
                  ? 'bg-rose-50 border-rose-200'
                  : 'bg-amber-50 border-amber-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`text-lg ${getStatusColor(check.status)}`}>
                  {getStatusIcon(check.status)}
                </span>
                <div>
                  <span className={`font-medium text-sm ${getStatusColor(check.status)}`}>
                    {check.label}
                  </span>
                  {check.message && (
                    <p className="text-xs text-slate-600 mt-1">
                      {check.message}
                    </p>
                  )}
                </div>
              </div>
              
              {check.status === 'error' && (
                <button className="text-xs bg-white border border-slate-200 px-2 py-1 rounded hover:bg-slate-50">
                  Fix
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ConditionChecks;