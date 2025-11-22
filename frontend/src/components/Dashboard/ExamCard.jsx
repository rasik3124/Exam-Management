// src/components/Dashboard/ExamCard.jsx
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
      scale: 1.02,
      duration: 0.2,
      ease: 'power2.out'
    });
    
    gsap.to([deleteBtnRef.current, editBtnRef.current], {
      opacity: 1,
      scale: 1,
      duration: 0.15,
      stagger: 0.05
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      scale: 1,
      duration: 0.2,
      ease: 'power2.out'
    });
    
    gsap.to([deleteBtnRef.current, editBtnRef.current], {
      opacity: 0,
      scale: 0.8,
      duration: 0.15
    });
  };

  const handleClick = () => {
    onClick(exam.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(exam.id);
  };

  return (
    <div
      id={`exam-${exam.id}`}
      ref={cardRef}
      className={`exam-card group relative rounded-xl p-6 cursor-pointer transition-all duration-300 border ${
        isDark
          ? 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-750 shadow-lg'
          : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-md'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Action Buttons */}
      <div className="absolute top-3 right-3 flex gap-1">
        <button
          ref={editBtnRef}
          className={`opacity-0 scale-80 p-2 rounded-lg transition-colors ${
            isDark 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          <Edit3 className={`w-3 h-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
        </button>
        <button
          ref={deleteBtnRef}
          className="opacity-0 scale-80 p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
          onClick={handleDelete}
        >
          <Trash2 className="w-3 h-3 text-red-500" />
        </button>
      </div>

      {/* Card Content */}
      <div className="flex flex-col items-center text-center">
        <div className={`w-16 h-16 mb-4 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
          isDark ? 'bg-blue-500/20' : 'bg-blue-100'
        }`}>
          <FileText className={`w-8 h-8 ${
            isDark ? 'text-blue-400' : 'text-blue-600'
          }`} />
        </div>
        
        <h3 className={`font-semibold text-lg mb-2 tracking-wide truncate w-full ${
          isDark ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {exam.name}
        </h3>
        
        <div className={`flex items-center gap-1 text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <Calendar className="w-4 h-4" />
          <span>{new Date(exam.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;