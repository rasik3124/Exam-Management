import { motion } from 'framer-motion';

const CommandCenter = ({ validation, capacity, onProceed, onExportReport, onDryRun }) => {
  const canProceed = !validation.hasBlockingErrors && capacity.utilization <= 100;

  return (
    <div className="bg-white border-t border-slate-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Status Indicator */}
          <div className={`flex items-center space-x-2 ${
            canProceed ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              canProceed ? 'bg-emerald-500' : 'bg-rose-500'
            }`}></div>
            <span className="text-sm font-medium">
              {canProceed ? 'Ready for Allocation' : 'Resolution Required'}
            </span>
          </div>

          {/* Issue Count */}
          {!canProceed && (
            <div className="text-sm text-slate-600">
              {validation.errorCount} issue{validation.errorCount !== 1 ? 's' : ''} to resolve
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          {/* Export Report */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExportReport}
            className="px-4 py-2 border border-slate-300 text-slate-700  rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Export Warning Report
          </motion.button>

          {/* Dry Run */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDryRun}
            className="px-4 py-2 bg-emerald-500 text-slate-700  rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
          >
            Generate Dry Run
          </motion.button>

          {/* Manual Edit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-amber-500 text-slate-700  rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors"
          >
            Manual Edit Mode
          </motion.button>

          {/* Proceed to Allocation */}
          <motion.button
            whileHover={{ scale: canProceed ? 1.02 : 1 }}
            whileTap={{ scale: canProceed ? 0.98 : 1 }}
            onClick={onProceed}
            disabled={!canProceed}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-colors ${
              canProceed
                ? 'bg-blue-600 text-slate-700  hover:bg-blue-700'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            Proceed to Auto-Allocation
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;