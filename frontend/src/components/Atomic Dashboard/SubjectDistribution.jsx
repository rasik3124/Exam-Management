const SubjectDistribution = ({ subjects = [], students = [] }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
        Subject Distribution
      </h3>

      {subjects.length === 0 && (
        <div className="text-center text-slate-400 text-sm py-8">
          No subjects available
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => {
          const subjectStudents = (students || []).filter((s) =>
            (s.subjects || []).some((sub) => {
              const code = typeof sub === 'string' ? sub : sub.code;
              return code === subject.code;
            })
          );

          return (
            <div
              key={subject.code}
              className="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: subject.color }}
                ></div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900 text-sm">
                    {subject.name}
                  </h4>
                  <p className="text-xs text-slate-500">{subject.code}</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">
                  Sem {subject.semester}
                </span>
                <span className="font-semibold text-slate-900">
                  {subjectStudents.length} students
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectDistribution;
