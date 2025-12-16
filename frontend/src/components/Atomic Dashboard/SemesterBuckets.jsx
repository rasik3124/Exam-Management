import { motion } from 'framer-motion';

const SemesterBuckets = ({ semesterDistribution = {} }) => {
  const entries = Object.entries(semesterDistribution);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">
        Semester Distribution (Selected Day)
      </h3>

      {entries.length === 0 ? (
        <p className="text-xs text-slate-500">
          No students mapped for this day
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {entries.map(([semester, count], index) => (
            <motion.div
              key={semester}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="text-center p-4 rounded-lg bg-slate-50 border border-slate-200"
            >
              <div className="text-2xl font-bold text-slate-900">
                {count}
              </div>
              <div className="text-xs text-slate-600">
                Semester {semester}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SemesterBuckets;
