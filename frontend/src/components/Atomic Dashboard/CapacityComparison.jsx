import { motion } from 'framer-motion';

const CapacityComparison = ({ day }) => {
  if (!day) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <p className="text-sm text-slate-500">
          No day selected
        </p>
      </div>
    );
  }

  const {
    studentCount = 0,
    totalCapacity = 0,
    remainingCapacity = 0,
    utilizationPercent = 0
  } = day;

  const getStatusColor = () => {
    if (utilizationPercent > 100) return 'bg-rose-500';
    if (utilizationPercent > 90) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStatusText = () => {
    if (utilizationPercent > 100) return 'OVERFLOW';
    if (utilizationPercent > 90) return 'NEAR FULL';
    return 'SAFE';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">
        Capacity Analysis (Selected Day)
      </h3>

      <div className="space-y-1 text-sm mb-4">
        <div className="flex justify-between">
          <span>Total Capacity</span>
          <span className="font-semibold">{totalCapacity}</span>
        </div>

        <div className="flex justify-between">
          <span>Students</span>
          <span className="font-semibold">{studentCount}</span>
        </div>

        <div className="flex justify-between">
          <span>Remaining</span>
          <span
            className={`font-semibold ${
              remainingCapacity < 0
                ? 'text-rose-600'
                : 'text-emerald-600'
            }`}
          >
            {remainingCapacity}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Utilization</span>
          <span className="font-semibold">
            {utilizationPercent}%
          </span>
        </div>
      </div>

      {/* Capacity Meter */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>Seat Utilization</span>
          <span>{utilizationPercent}%</span>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(utilizationPercent, 100)}%` }}
            transition={{ duration: 0.8 }}
            className={`h-3 rounded-full ${getStatusColor()}`}
          />
        </div>
      </div>

      <div
        className={`text-center py-3 rounded-lg border text-sm font-medium ${
          utilizationPercent > 100
            ? 'bg-rose-50 text-rose-800 border-rose-200'
            : utilizationPercent > 90
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}
      >
        {getStatusText()}
      </div>
    </div>
  );
};

export default CapacityComparison;
