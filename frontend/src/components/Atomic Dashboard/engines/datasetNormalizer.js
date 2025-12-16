export const normalizeDataset = (studentData, timetableData, subjectMappings) => {

  const mappedStudentData = studentData.map(student => ({
    ...student,
    subjects: student.subjects
      .map(subject => subjectMappings[normalizeSubjectName(subject)] || subject)
      .filter(Boolean)
  }));

  const mappedTimetableData = timetableData.map(entry => ({
    ...entry,
    subjectCode: subjectMappings[normalizeSubjectName(entry.SUBJECT_CODE || entry.subjectCode)] || entry.SUBJECT_CODE || entry.subjectCode,
    subjectName: subjectMappings[normalizeSubjectName(entry.SUBJECT_NAME || entry.subjectName || '')] || entry.SUBJECT_NAME || entry.subjectName || null
  }));

  const daysMap = new Map();

  mappedTimetableData.forEach(entry => {

    const dayKey = `${entry.EXAM_DATE || entry.examDate}-${entry.session}`;

    if (!daysMap.has(dayKey)) {
      daysMap.set(dayKey, {
        date: entry.EXAM_DATE || entry.examDate,
        session: entry.session,
        subjects: new Map(),
        students: new Set()
      });
    }

    const day = daysMap.get(dayKey);

    if (!day.subjects.has(entry.subjectCode)) {
      day.subjects.set(entry.subjectCode, {
        code: entry.subjectCode,
        name: entry.subjectName || null,
        semester: entry.semester || null,
        students: new Set()
      });
    }
  });

  mappedStudentData.forEach(student => {
    student.subjects.forEach(subject => {

      for (const [_, day] of daysMap) {

        if (day.subjects.has(subject)) {

          day.students.add(student.REG_NO);
          day.subjects.get(subject).students.add(student.REG_NO);

        }
      }
    });
  });

  const days = Array.from(daysMap.values()).map(day => ({
    date: day.date,
    session: day.session,
    subjects: Array.from(day.subjects.values()).map(subject => ({
      ...subject,
      students: Array.from(subject.students),
      count: subject.students.size
    })),
    students: Array.from(day.students),
    count: day.students.size
  }));

  return {
    days,
    studentCount: mappedStudentData.length
  };
};

const normalizeSubjectName = (name) => {
  if (!name) return '';
  return String(name).trim().toUpperCase().replace(/\s+/g, ' ');
};
