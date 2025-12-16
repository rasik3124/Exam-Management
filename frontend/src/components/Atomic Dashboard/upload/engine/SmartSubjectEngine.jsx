// components/engine/SmartSubjectEngine.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useExamStore } from '../../store/useExamStore';

const SmartSubjectEngine = () => {
  const [conflicts, setConflicts] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [canonicalName, setCanonicalName] = useState('');
  
  const rawStudents = useExamStore(state => state.studentDataByExam?.[examId]);
  const studentData = Array.isArray(rawStudents) ? rawStudents : [];
  const rawTimetable = useExamStore(state => state.timetableDataByExam?.[examId]);
  const timetableData = Array.isArray(rawTimetable) ? rawTimetable : [];
  const subjectMappings = useExamStore(state => state.subjectMappings);
  const processSubjectConflicts = useExamStore(state => state.processSubjectConflicts);
  const resolveSubjectConflict = useExamStore(state => state.resolveSubjectConflict);

  useEffect(() => {
    const loadConflicts = async () => {
      if (studentData.length > 0 && timetableData.length > 0) {
        const detectedConflicts = await processSubjectConflicts();
        setConflicts(detectedConflicts.filter(conflict => !conflict.resolved));
      }
    };
    
    loadConflicts();
  }, [studentData, timetableData, subjectMappings, processSubjectConflicts]);

  const handleResolveGroup = async (groupId, action, customName = null) => {

    const group = conflicts.find(c => c.id === groupId);
    if (!group) return;

    if (action === 'separate') {
      setConflicts(prev => prev.filter(c => c.id !== groupId));
      return;
    }

    const normalize = s => s.trim().toUpperCase();

    let canonical = normalize(customName || group.subjects[0]);
    let aliases = [...new Set(group.subjects.map(normalize))];

    await resolveSubjectConflict(groupId, canonical, aliases);

    const refreshed = await processSubjectConflicts();
    setConflicts(refreshed.filter(c => !c.resolved));

    setActiveGroup(null);
    setCanonicalName('');
  };

  if (conflicts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          No Subject Conflicts Found
        </h3>
        <p className="text-slate-600">
          All subject names are consistent between student data and timetable.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900 flex items-center">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Subject Name Resolution
        </h2>
        <p className="text-slate-600 mt-1">
          Review similar subject names and decide how to merge them
        </p>
      </div>

      <div className="p-6 space-y-6">
        {conflicts.map((group) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-slate-200 rounded-lg p-6"
          >
            <h3 className="font-medium text-slate-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
              Similar Subject Names Found
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {group.subjects.map((subject, index) => (
                <div
                  key={subject}
                  className={`p-3 border rounded-lg ${
                    index === 0 ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm">{subject}</span>
                    {index === 0 && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Suggested
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleResolveGroup(group.id, 'merge')}
                className="px-4 py-2 bg-blue-600 text-slate-700 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Merge as "{group.subjects[0]}"
              </button>
              
              <button
                onClick={() => {
                setCanonicalName('');
                setActiveGroup(activeGroup === group.id ? null : group.id); }}
                className="px-4 py-2 border border-slate-300 text-slate-700  rounded-lg text-sm hover:bg-slate-50 transition-colors"
              >
                Use Custom Name
              </button>
              
              <button
                onClick={() => handleResolveGroup(group.id, 'separate')}
                className="px-4 py-2 border border-slate-300 text-slate-700  rounded-lg text-sm hover:bg-slate-50 transition-colors"
              >
                Keep Separate
              </button>
            </div>

            {/* Custom Name Input */}
            {activeGroup === group.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-slate-200"
              >
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={canonicalName}
                    onChange={(e) => setCanonicalName(e.target.value)}
                    placeholder="Enter canonical subject name..."
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleResolveGroup(group.id, 'merge', canonicalName)}
                    disabled={!canonicalName.trim()}
                    className="px-4 py-2 bg-blue-600 text-slate-700 rounded-lg text-sm hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Merge with Custom Name
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SmartSubjectEngine;