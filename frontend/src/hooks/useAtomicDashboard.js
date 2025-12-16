import { useState, useEffect } from 'react';
import { useExamStore } from '../Stores/useExamStore';
// import { normalizeDataset } from '../components/Atomic Dashboard/engines/datasetNormalizer';

// 🔥 Load rooms from localStorage using examId
const loadRooms = (examId) => {
  try {
    const saved = JSON.parse(localStorage.getItem(`rooms_${examId}`));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return []
  }
};

// 🔹 Get exam title from localStorage
const getExamTitle = (examId) => {
  try {
    const exams = JSON.parse(localStorage.getItem("exams")) || [];
    const exam = exams.find(e => e.id === examId);
    return exam?.name || "Exam";
  } catch {
    return "Exam";
  }
};


const excelToJsDate = (value) => {
  if (!value) return null;

  // string number -> number
  if (typeof value === 'string' && isNaN(value) === false) {
    value = Number(value);
  }

  if (!isNaN(value)) {
    const excelEpoch = new Date(1899, 11, 30);
    return new Date(excelEpoch.getTime() + value * 86400000);
  }

  const parsed = Date.parse(value);
  return isNaN(parsed) ? null : new Date(parsed);
};

export const useAtomicDashboard = ({ examId, selectedDayId }) => {
  const rawStudent = useExamStore(state => state.studentDataByExam[examId]);
  const rawTimetable = useExamStore(state => state.timetableDataByExam[examId]);
  const examTitle = getExamTitle(examId);

  // 🔥 Always provide safe fallback array
  const studentData = Array.isArray(rawStudent) ? rawStudent : [];
  const timetableData = Array.isArray(rawTimetable) ? rawTimetable : [];

    const updateValidation = (newState) => {
    setValidation(prev => ({ ...prev, ...newState }));
  };
 

  const [examData, setExamData] = useState(null);
  const [students, setStudents] = useState([]);
  const [validation, setValidation] = useState({});
  const [capacity, setCapacity] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    setIsLoading(true);

    // 🔹 Rooms for this exam
    const loadedRooms = loadRooms(examId);
    setRooms(loadedRooms);

    const totalCapacity = loadedRooms.reduce(
      (sum, room) => sum + (room.totalCapacity || room.capacity || 0),
      0
    );

    console.log('✅ DASHBOARD examId:', examId);
    console.log('✅ DASHBOARD ROOMS:', loadedRooms);
    console.log('✅ DASHBOARD CAPACITY:', totalCapacity);

    if (!timetableData.length) {
      setExamData({
        title: `${examTitle}`,
        sessionCode: 'FN',
        department: 'Multiple',
        days: [],
        subjects: []
      });

      setStudents(studentData);

      setCapacity({
        total: totalCapacity,
        utilized: studentData.length,
        utilization: totalCapacity
          ? Math.round((studentData.length / totalCapacity) * 100)
          : 0
      });

      setValidation({
        hasBlockingErrors: false,
        hasWarnings: false
      });

      setIsLoading(false);
      return;
    }

    // SUBJECT MAP
    const colorPalette = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
      '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
    ];

    const subjectMap = {};

    timetableData.forEach((row, idx) => {
      const code = row.SUBJECT_CODE;
      if (!code) return;

      if (!subjectMap[code]) {
        subjectMap[code] = {
          code,
          name: row.SUBJECT_NAME || code,
          semester: row.SEMESTER || 'N/A',
          color: colorPalette[idx % colorPalette.length]
        };
      }
    });

    const grouped = {};

    timetableData.forEach((row) => {
      const key = `${row.EXAM_DATE}_${row.SESSION}`;

      if (!grouped[key]) {
        grouped[key] = {
          examDate: row.EXAM_DATE,
          session: row.SESSION,
          subjects: []
        };
      }

      if (!grouped[key].subjects.includes(row.SUBJECT_CODE)) {
        grouped[key].subjects.push(row.SUBJECT_CODE);
      }
    });

    const days = Object.values(grouped).map((group, index) => {
      const dateObj = excelToJsDate(group.examDate);

      // 🔹 Students writing exams on this day
      const dayStudents = studentData.filter((s) =>
        (s.SUBJECT || s.subjects || []).some((sub) => {
          const code = typeof sub === 'string' ? sub : sub.code;
          return group.subjects.includes(code);
        })
      );

      // 🔹 Semester distribution (DAY-WISE)
      const semesterDistribution = {};
      dayStudents.forEach((s) => {
        const sem = s.SEMESTER || s.semester || 'Unknown';
        semesterDistribution[sem] = (semesterDistribution[sem] || 0) + 1;
      });

      const studentCount = dayStudents.length;
      const remainingCapacity = totalCapacity - studentCount;
      const utilizationPercent = totalCapacity
        ? Math.round((studentCount / totalCapacity) * 100)
        : 0;

      // ✅ IMPORTANT: return INSIDE map
      return {
        id: `${group.examDate}_${group.session}`,
        label: `Day ${index + 1}`,
        date: dateObj ? dateObj.toLocaleDateString('en-GB') : String(group.examDate),
        sessionCode: group.session,

        studentCount,
        totalCapacity,
        remainingCapacity,
        utilizationPercent,
        semesterDistribution,

        subjects: group.subjects.map(
          (code) =>
            subjectMap[code] || {
              code,
              name: code,
              semester: 'N/A',
              color: '#64748b'
            }
        )
      };
    });


    const allSubjects = Object.values(subjectMap);

    setExamData({
      title: `${examTitle}`,
      sessionCode: 'FN',
      department: 'Multiple',
      days,
      subjects: allSubjects
    });

    setStudents(studentData);

    setValidation({
      hasBlockingErrors: false,
      hasWarnings: false
    });

    setCapacity({
      total: totalCapacity,
      utilized: studentData.length,
      utilization: totalCapacity
        ? Math.round((studentData.length / totalCapacity) * 100)
        : 0
    });

    setIsLoading(false);

}, [examId, studentData.length, timetableData.length]);


  return {
    examData,
    students,
    validation,
    capacity,
    rooms,
    isLoading,
    updateValidation,
    refreshData: () => {},
    resolveIssue: () => {},
    triggerAllocation: () => {}
  };
};
