// engines/smartSubjectEngine.js
export const findSubjectConflicts = (studentData, timetableData) => {
  const allStudentSubjects = new Set();
  const allTimetableSubjects = new Set();
  
  // Extract subjects from student data
  studentData.forEach(student => {
    student.subjects.forEach(subject => {
      if (subject && subject.trim()) {
        allStudentSubjects.add(normalizeSubjectName(subject));
      }
    });
  });
  
  // Extract subjects from timetable data
  timetableData.forEach(entry => {
    if (entry.subjectCode) {
      allTimetableSubjects.add(normalizeSubjectName(entry.subjectCode));
    }
    if (entry.subjectName) {
      allTimetableSubjects.add(normalizeSubjectName(entry.subjectName));
    }
  });
  
  // Find conflicts and similarities
  const conflicts = [];
  const allSubjects = [...allStudentSubjects, ...allTimetableSubjects];
  
  for (let i = 0; i < allSubjects.length; i++) {
    for (let j = i + 1; j < allSubjects.length; j++) {
      const similarity = calculateSimilarity(allSubjects[i], allSubjects[j]);
      if (similarity > 0.7) { // 70% similarity threshold
        conflicts.push({
          groupId: `group-${conflicts.length}`,
          subjects: [allSubjects[i], allSubjects[j]],
          similarity,
          canonical: null,
          resolved: false
        });
      }
    }
  }
  
  // Group related conflicts
  return groupRelatedConflicts(conflicts);
};

export const resolveSubjectGroup = (groupId, canonicalName, aliases, currentMappings) => {
  const newMappings = { ...currentMappings };
  
  aliases.forEach(alias => {
    newMappings[alias] = canonicalName;
  });
  
  // Also map the canonical to itself
  newMappings[canonicalName] = canonicalName;
  
  return newMappings;
};

const normalizeSubjectName = (name) => {
  return String(name)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, ' ') // Replace special chars with spaces
    .replace(/\s+/g, ' ')       // Collapse multiple spaces
    .trim();
};

const calculateSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  // Direct inclusion check
  if (longer.includes(shorter) || shorter.includes(longer)) {
    return 0.9;
  }
  
  // Levenshtein distance based similarity
  const distance = levenshteinDistance(longer, shorter);
  return 1 - distance / longer.length;
};

const levenshteinDistance = (str1, str2) => {
  const matrix = Array(str2.length + 1).fill(null).map(() => 
    Array(str1.length + 1).fill(null)
  );
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  
  return matrix[str2.length][str1.length];
};

const groupRelatedConflicts = (conflicts) => {
  const groups = [];
  const subjectToGroup = new Map();
  
  conflicts.forEach(conflict => {
    let targetGroup = null;
    
    // Check if any subject in this conflict is already in a group
    for (const subject of conflict.subjects) {
      if (subjectToGroup.has(subject)) {
        targetGroup = subjectToGroup.get(subject);
        break;
      }
    }
    
    if (!targetGroup) {
      targetGroup = {
        id: `group-${groups.length}`,
        subjects: new Set(),
        canonical: null,
        resolved: false
      };
      groups.push(targetGroup);
    }
    
    // Add all subjects from this conflict to the group
    conflict.subjects.forEach(subject => {
      targetGroup.subjects.add(subject);
      subjectToGroup.set(subject, targetGroup);
    });
  });
  
  return groups.map(group => ({
    ...group,
    subjects: Array.from(group.subjects)
  }));
};