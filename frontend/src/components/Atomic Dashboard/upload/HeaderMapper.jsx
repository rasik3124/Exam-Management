// components/upload/HeaderMapper.jsx
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { detectColumnTypes } from '../../Atomic Dashboard/engines/excelParser';

const HeaderMapper = ({ headers, rows, onMappingComplete, fileType }) => {
  const [mappings, setMappings] = useState({});
  const columnAnalysis = useMemo(() => detectColumnTypes(headers, rows), [headers, rows]);

  const requiredFields = {
    student: [
      { key: 'registrationNumber', label: 'Registration Number', description: 'Unique student identifier' },
      { key: 'semester', label: 'Semester', description: 'Current semester (1-8)' },
      { key: 'department', label: 'Department', description: 'Student department' },
      { key: 'name', label: 'Student Name', description: 'Optional student name', optional: true },
      { key: 'subjects', label: 'Subjects', description: 'Multiple subject columns', multiple: true }
    ],
    timetable: [
      { key: 'examDate', label: 'Exam Date', description: 'Date of examination' },
      { key: 'session', label: 'Session', description: 'FN (Morning) or AN (Afternoon)' },
      { key: 'subjectCode', label: 'Subject Code', description: 'Unique subject identifier' },
      { key: 'subjectName', label: 'Subject Name', description: 'Full subject name', optional: true },
      { key: 'semester', label: 'Semester', description: 'Semester for this subject', optional: true }
    ]
  }[fileType];

  const handleMappingChange = (fieldKey, columnIndex) => {
    if (fieldKey === 'subjects') {
      // For subjects, toggle selection
      const currentSubjects = mappings[fieldKey] || [];
      const newSubjects = currentSubjects.includes(columnIndex)
        ? currentSubjects.filter(idx => idx !== columnIndex)
        : [...currentSubjects, columnIndex];
      
      setMappings(prev => ({ ...prev, [fieldKey]: newSubjects }));
    } else {
      setMappings(prev => ({ ...prev, [fieldKey]: columnIndex }));
    }
  };

  const isMappingComplete = requiredFields.every(field => 
    field.optional || (mappings[field.key] !== undefined && 
    (field.multiple ? mappings[field.key]?.length > 0 : true))
  );

  const transformMapping = (raw) => {

    if (fileType === "student") {
      return {
        REG_NO: raw.registrationNumber,
        SEMESTER: raw.semester,
        DEPARTMENT: raw.department,
        NAME: raw.name,
        SUBJECT: raw.subjects
      };
    }

    if (fileType === "timetable") {
      return {
        EXAM_DATE: raw.examDate,
        SESSION: raw.session,
        SUBJECT_CODE: raw.subjectCode,
        SUBJECT_NAME: raw.subjectName,
        SEMESTER: raw.semester
      };
    }
  };

  const handleComplete = () => {
    const transformed = transformMapping(mappings);
    console.log("✅ UI Mapping Result (after transform):", transformed);
    onMappingComplete(transformed);
  };


  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Map Your Columns
        </h2>
        <p className="text-slate-600">
          Match your Excel columns to the required fields
        </p>
      </div>

      <div className="p-6">
        {/* Required Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {requiredFields.map((field) => (
            <div key={field.key} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-slate-900">{field.label}</h3>
                  <p className="text-sm text-slate-500 mt-1">{field.description}</p>
                </div>
                {field.optional && (
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                    Optional
                  </span>
                )}
              </div>

              {field.multiple ? (
                <div className="space-y-2">
                  {columnAnalysis.map((column, index) => (
                    <label key={index} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mappings[field.key]?.includes(index) || false}
                        onChange={() => handleMappingChange(field.key, index)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700  flex-1">
                        {column.header}
                      </span>
                      <span className="text-xs text-slate-400">
                        {column.sampleValues[0] || 'Empty'}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <select
                  value={mappings[field.key] ?? ''}
                  onChange={(e) => handleMappingChange(field.key, e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select a column...</option>
                  {columnAnalysis.map((column, index) => (
                    <option key={index} value={index}>
                      {column.header} {column.sampleValues[0] && `- Sample: ${column.sampleValues[0]}`}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>

        {/* Data Preview */}
        <div className="border border-slate-200 rounded-lg">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-medium text-slate-900">Data Preview</h3>
            <p className="text-sm text-slate-600">First 5 rows of your data</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {headers.map((header, index) => (
                    <th key={index} className="text-left p-3 font-medium text-slate-700 ">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 5).map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-slate-100">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="p-3 text-slate-600">
                        {cell || <span className="text-slate-400">Empty</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-6">
          <button
            onClick={handleComplete}
            disabled={!isMappingComplete}
            className={`
              px-6 py-2 rounded-lg font-medium transition-colors
              ${isMappingComplete
                ? 'bg-blue-600 text-slate-700  hover:bg-blue-700'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }
            `}
          >
            Apply Mapping & Validate
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderMapper;