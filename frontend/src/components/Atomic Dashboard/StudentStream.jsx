import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentStream = ({ students, exam, onStudentAction, selectedDayId }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filter, setFilter] = useState('all');

  const safeExam = exam || { days: [] };
  const currentDay = safeExam.days?.find(d => d.id === selectedDayId);

  // ✅ subject code -> name lookup map
  const subjectNameMap = {};
  (safeExam.subjects || []).forEach(sub => {
    subjectNameMap[sub.code] = sub.name || sub.code;
  });
  const daySubjectCodes = (currentDay?.subjects || []).map(s => s.code);

  // ✅ ONLY STUDENTS OF THIS DAY
  const dayStudents = students.filter(student =>
    (student.subjects || []).some(sub => {
      const code = typeof sub === "string" ? sub : sub.code;
      return daySubjectCodes.includes(code);
    })
  );

  const getStatusIcon = (student) => {
    if (student.duplicate) return ' ⚠️';
    if (student.clash) return ' ❌';
    if (student.incomplete) return ' 🟡';
    return ' ✅';
  };

  const getStatusColor = (student) => {
    if (student.duplicate) return 'border-amber-200 bg-amber-50';
    if (student.clash) return 'border-rose-200 bg-rose-50';
    if (student.incomplete) return 'border-amber-200 bg-amber-50';
    return 'border-emerald-200 bg-emerald-50';
  };

  const filteredStudents = dayStudents.filter(student => {
    if (filter === 'issues') return student.duplicate || student.clash || student.incomplete;
    if (filter === 'duplicates') return student.duplicate;
    if (filter === 'clashes') return student.clash;
    return true;
  });

  const handleContextMenu = (student, e) => {
    e.preventDefault();
    setSelectedStudent(student);
  };

  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-slate-900">
            Student Stream (Day Based)
          </h2>
          <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
            {filteredStudents.length} students
          </span>
        </div>

        <div className="flex space-x-1 text-xs">
          {['all', 'issues', 'duplicates', 'clashes'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 rounded-full capitalize ${
                filter === filterType
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-600 hover:bg-blue-400'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      {/* Student List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredStudents.map((student, index) => {

            // ✅ only subjects that match today's exam
            const visibleSubjects = (student.subjects || []).filter(s => {
              const code = typeof s === "string" ? s : s.code;
              return daySubjectCodes.includes(code);
            });

            return (
              <motion.div
                key={
                  student.id ||
                  student.registrationNumber ||
                  student.REG_NO ||
                  student.email ||
                  `${student.registrationNumber || student.REG_NO}-${index}`
                }
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${getStatusColor(student)}`}
                onContextMenu={(e) => handleContextMenu(student, e)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-4">
                      {index + 1}.
                      <span className="text-sm">{getStatusIcon(student)}</span>
                      <span className="font-mono font-semibold text-slate-900 text-sm">
                        {student.registrationNumber || student.REG_NO}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 flex space-x-4 mt-1">
                      {student.name || student.NAME}
                    </p>

                    <div className="text-xs text-slate-500 flex space-x-4 mt-1">
                      <span>Sem {student.semester || student.SEMESTER}</span>
                      <span>{student.department || student.DEPARTMENT}</span>
                    </div>

                    {/* Subject badges */}
                    <div className="flex flex-wrap gap-1">
                      {visibleSubjects.map((subject, i) => {
                        const code = typeof subject === "string" ? subject : subject.code;
                        return (
                          <div className="relative group">
                            <span
                              key={`student-${student.registrationNumber || student.REG_NO || index}-${index}`}
                              className="px-2 py-1 text-xs rounded-full font-medium 
                                        border border-blue-300 
                                        bg-blue-100 text-blue-800 
                                        cursor-default transition hover:bg-blue-200"
                            >
                              {code}
                            </span>
                              {/* Tooltip */}
                              <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 
                                              opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100
                                              transition-all duration-200 pointer-events-none">

                                <div className="bg-slate-900 text-white text-xs rounded-lg shadow-lg px-3 py-2 w-max max-w-xs">
                                  <p className="font-semibold">{subjectNameMap[code] || "Unknown Subject"}</p>
                                  <p className="text-slate-300 text-[10px] mt-1">Subject Code: {code}</p>
                                </div>

                                {/* Arrow */}
                                <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1"></div>
                              </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentStream;
