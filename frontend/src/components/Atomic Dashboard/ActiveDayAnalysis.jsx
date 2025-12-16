import SubjectDistribution from './SubjectDistribution';
import SemesterBuckets from './SemesterBuckets';
import CapacityComparison from './CapacityComparison';
import ConditionChecks from './ConditionChecks';

const ActiveDayAnalysis = ({ exam, students, validation, capacity, selectedDayId }) => {
  const activeDay = exam?.days?.find(day => day.id === selectedDayId) || {};

  // ✅ Safety fallback
  const safeExam = exam || { days: [], subjects: [] };

  // ✅ Find the active day
  const currentDay =
    safeExam.days?.find(day => day.id === selectedDayId) || null;

  // ✅ Use ONLY subjects of the selected day
  const daySubjects = currentDay?.subjects || [];
  const {
    semesterDistribution = {},
    studentCount = 0,
    totalCapacity = 0,
    remainingCapacity = 0,
    utilizationPercent = 0
  } = activeDay;


  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">

        {/* ✅ SUBJECT DISTRIBUTION IS NOW DAY-WISE */}
        <SubjectDistribution 
          subjects={daySubjects}
          students={students}
          currentDay={currentDay}
        />

        {/* ✅ Semester Buckets */}
        <SemesterBuckets
          semesterDistribution={activeDay?.semesterDistribution}
        />

        {/* ✅ Capacity */}
        <CapacityComparison day={activeDay} />

        {/* ✅ Condition Engine */}
        <ConditionChecks validation={validation} />

      </div>
    </div>
  );
};

export default ActiveDayAnalysis;
