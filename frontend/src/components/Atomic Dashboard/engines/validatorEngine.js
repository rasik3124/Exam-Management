// engines/validatorEngine.js
export const validateStudentData = (rows) => {

  const errors = [];
  const cleanData = [];
  const seen = new Set();

  rows.forEach((row, index) => {

    const student = {
      subjects: []
    };

    // ✅ DIRECT OBJECT ACCESS
    student.REG_NO = row.REG_NO?.toString().trim();
    student.DEPARTMENT = row.DEPARTMENT?.toString().trim();
    student.NAME = row.NAME?.toString().trim() || null;
    student.SEMESTER = row.SEMESTER;

    // ✅ SUBJECTS FIX
    if (Array.isArray(row.SUBJECT)) {
      student.subjects = row.SUBJECT
        .filter(Boolean)
        .map(s => String(s).trim().toUpperCase());
    }

    const rowErrors = [];

    // ✅ REG NO
    if (!student.REG_NO) {
      rowErrors.push(buildError(index, "missing_registration", "Registration Number is required"));
    } else if (seen.has(student.REG_NO)) {
      rowErrors.push(buildError(index, "duplicate_registration", "Duplicate Registration Number"));
      student._duplicate = true;
    } else {
      seen.add(student.REG_NO);
    }

    // ✅ SEMESTER
    const sem = parseInt(student.SEMESTER);
    if (!sem || sem < 1 || sem > 8) {
      rowErrors.push(buildError(index, "missing_semester", "Invalid or missing semester"));
    } else {
      student.semester = sem;
    }

    // ✅ DEPARTMENT
    if (!student.DEPARTMENT) {
      rowErrors.push(buildWarning(index, "missing_department", "Missing department"));
    }

    // ✅ SUBJECTS
    if (!student.subjects.length) {
      rowErrors.push(buildWarning(index, "no_subjects", "No subjects selected"));
    }

    errors.push(...rowErrors);
    cleanData.push(student);
  });

  return { cleanData, errors };
};

export const validateTimetableData = (rows, headerMap) => {

  if (!headerMap || typeof headerMap !== "object") {
    throw new Error("Header mapping object required");
  }

  const errors = [];
  const cleanData = [];

  rows.forEach((row, index) => {
    const entry = {};
    const rowErrors = [];

    // headerMap: { EXAM_DATE: 0, SESSION: 1, ... }
    Object.entries(headerMap).forEach(([field, colIndex]) => {
      if (colIndex == null) return;
      const value = row[colIndex];
      if (value == null || value === "") return;
      entry[field] = String(value).trim();
    });

    // DATE
    if (!entry.EXAM_DATE) {
      rowErrors.push(buildError(index, "missing_date", "Missing exam date"));
    } else {
      entry.examDate = entry.EXAM_DATE;   // alias for UI
    }

    // SESSION
    const session = normalizeSession(entry.SESSION);
    if (!session) {
      rowErrors.push(buildError(index, "missing_session", "Invalid session"));
    } else {
      entry.session = session;
    }

    // SUBJECT CODE
    if (!entry.SUBJECT_CODE) {
      rowErrors.push(buildError(index, "missing_subject_code", "Missing subject code"));
    } else {
      entry.subjectCode = entry.SUBJECT_CODE; // alias
    }

    errors.push(...rowErrors);
    cleanData.push(entry);
  });

  return { cleanData, errors };
};



// Helper functions

const normalizeSession = (value) => {
  if (!value) return null;
  value = value.toUpperCase();

  if (["FN", "FORENOON", "MORNING", "AM"].includes(value)) return "FN";
  if (["AN", "AFTERNOON", "EVENING", "PM"].includes(value)) return "AN";

  return null;
};

const buildError = (rowIndex, type, message) => ({
  id: crypto.randomUUID(),
  type,
  message,
  severity: "error",
  row: rowIndex + 2
});

const buildWarning = (rowIndex, type, message) => ({
  id: crypto.randomUUID(),
  type,
  message,
  severity: "warning",
  row: rowIndex + 2
});