import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../../contexts/ThemeContext'
import { FileText, Edit3, Trash2, Calendar } from 'lucide-react';

const ExamCard = ({ exam, onClick, onDelete }) => {
  const cardRef = useRef();
  const deleteBtnRef = useRef();
  const editBtnRef = useRef();
  const { isDark } = useTheme();

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      scale: 1.03,
      duration: 0.25,
      ease: 'power2.out',
      boxShadow: isDark ? '0 10px 20px rgba(0, 0, 0, 0.4)' : '0 10px 20px rgba(0, 0, 0, 0.1)',
    });

    gsap.to([deleteBtnRef.current, editBtnRef.current], {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.2,
      stagger: 0.08,
      ease: 'back.out(1.7)'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      scale: 1,
      duration: 0.25,
      ease: 'power2.out',
      boxShadow: 'none',
    });

    gsap.to([deleteBtnRef.current, editBtnRef.current], {
      opacity: 0,
      scale: 0.8,
      y: -10,
      duration: 0.15
    });
  };

  const handleClick = () => {
    onClick(exam.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent card click event from firing
    gsap.to(cardRef.current, {
      opacity: 0,
      y: -20,
      scale: 0.8,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => onDelete(exam.id),
    });
  };

  // Placeholder for edit functionality
  const handleEdit = (e) => {
    e.stopPropagation();
    alert(`Editing exam: ${exam.name}`);
    // Implement actual edit modal/navigation here
  };

  return (
    <div
      id={`exam-${exam.id}`}
      ref={cardRef}
      className={`exam-card group relative rounded-3xl p-8 cursor-pointer transition-all duration-300 border
        flex flex-col items-center text-center h-64
        ${
        isDark
          ? 'bg-gray-800 border-gray-700 hover:border-blue-600/50 hover:bg-gray-750 shadow-md'
          : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50 shadow-sm'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Action Buttons */}
      <div className="absolute top-5 right-5 flex gap-2">
        <button
          ref={editBtnRef}
          className={`opacity-0 scale-80 -translate-y-2 p-2.5 rounded-full transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0
            ${
            isDark
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-gray-100'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
          }`}
          onClick={handleEdit}
          aria-label={`Edit ${exam.name}`}
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          ref={deleteBtnRef}
          className="opacity-0 scale-80 -translate-y-2 p-2.5 bg-red-500/20 rounded-full hover:bg-red-500/30 text-red-500 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0"
          onClick={handleDelete}
          aria-label={`Delete ${exam.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Card Content */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className={`w-20 h-20 mb-5 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
          isDark ? 'bg-blue-600/20' : 'bg-blue-100'
        }`}>
          <FileText className={`w-10 h-10 ${
            isDark ? 'text-blue-400' : 'text-blue-600'
          }`} />
        </div>

        <h3 className={`font-extrabold text-xl mb-2 tracking-wide truncate w-full px-2 ${
          isDark ? 'text-gray-100 group-hover:text-blue-300' : 'text-gray-900 group-hover:text-blue-600'
        } transition-colors duration-200`}>
          {exam.name}
        </h3>

        <div className={`flex items-center gap-2 text-sm font-medium ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <Calendar className="w-4 h-4" />
          <span>Created on {new Date(exam.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;