// src/components/Dashboard/AddExamCard.jsx
import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../../contexts/ThemeContext'
import { Plus } from 'lucide-react';

const AddExamCard = ({ onAddExam }) => {
  const cardRef = useRef();
  const { isDark } = useTheme();

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      scale: 1.02,
      rotation: 1,
      duration: 0.3,
      ease: 'back.out(1.7)'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      scale: 1,
      rotation: 0,
      duration: 0.3,
      ease: 'back.out(1.7)'
    });
  };

  const handleClick = () => {
    const tl = gsap.timeline();
    tl.to(cardRef.current, {
      scale: 0.95,
      duration: 0.1,
      ease: 'power2.in'
    })
    .to(cardRef.current, {
      scale: 1.05,
      duration: 0.2,
      ease: 'back.out(1.7)'
    })
    .to(cardRef.current, {
      scale: 1,
      duration: 0.1,
      onComplete: onAddExam
    });
  };

  return (
    <div
      ref={cardRef}
      className={`exam-card group relative rounded-xl p-6 cursor-pointer border-2 border-dashed transition-all duration-300 ${
        isDark
          ? 'border-gray-600 hover:border-gray-400 bg-gray-800/50 hover:bg-gray-750'
          : 'border-gray-300 hover:border-gray-400 bg-white/50 hover:bg-gray-50'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className={`w-16 h-16 mb-4 rounded-2xl flex items-center justify-center transition-colors ${
          isDark
            ? 'bg-green-500/20 group-hover:bg-green-500/30'
            : 'bg-green-100 group-hover:bg-green-200'
        }`}>
          <Plus className={`w-8 h-8 ${
            isDark ? 'text-green-400' : 'text-green-600'
          }`} />
        </div>
        
        <h3 className={`font-semibold text-lg mb-2 tracking-wide ${
          isDark ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Add New Exam
        </h3>
        
        <p className={`text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Create a new exam allocation project
        </p>
      </div>
    </div>
  );
};

export default AddExamCard;