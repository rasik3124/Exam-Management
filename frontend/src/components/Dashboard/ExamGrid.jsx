import React from 'react';
import ExamCard from './ExamCard';
import AddExamCard from './AddExamCard';

const ExamGrid = ({ exams, onExamClick, onExamDelete, onAddExam }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 sm:gap-8">
      <AddExamCard onAddExam={onAddExam} />

      {exams.map((exam) => (
        <ExamCard
          key={exam.id}
          exam={exam}
          onClick={onExamClick}
          onDelete={onExamDelete}
        />
      ))}
    </div>
  );
};

export default ExamGrid;