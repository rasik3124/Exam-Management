import { motion } from 'framer-motion';

const DayTabs = ({ days, selectedDayId, onSelectDay }) => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin">
      {days.map((day) => (
        <motion.button
          key={day.id}
          className={`
            flex flex-col items-center px-4 py-2 rounded-full text-sm font-medium transition-all
            ${selectedDayId === day.id
              ? 'bg-blue-600 text-slate-700 shadow-sm'
              : 'bg-white/10 text-slate/70 border border-white/20 hover:bg-white/20'
            }
          `}
          onClick={() => onSelectDay(day.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          layout
        >
          <span>{day.label}</span>
          {day.date && (
            <span className="text-xs opacity-80 mt-0.5">
              {new Date(day.date).toLocaleDateString()}
            </span>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default DayTabs;