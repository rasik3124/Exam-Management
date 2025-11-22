import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../../contexts/ThemeContext'
import { Plus } from 'lucide-react';

const AddExamCard = ({ onAddExam }) => {
  const cardRef = useRef();
  const { isDark } = useTheme();

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      scale: 1.03,
      rotation: 0.5,
      duration: 0.3,
      ease: 'back.out(1.7)',
      boxShadow: isDark ? '0 10px 20px rgba(0, 0, 0, 0.4)' : '0 10px 20px rgba(0, 0, 0, 0.1)',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      scale: 1,
      rotation: 0,
      duration: 0.3,
      ease: 'back.out(1.7)',
      boxShadow: 'none',
    });
  };

  const handleClick = () => {
    const tl = gsap.timeline();
    tl.to(cardRef.current, {
      scale: 0.98,
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
      className={`exam-card group relative rounded-3xl p-8 cursor-pointer border-2 border-dashed transition-all duration-300
        flex flex-col items-center justify-center text-center h-64
        ${
        isDark
          ? 'border-gray-700 hover:border-blue-500 bg-gray-800/50 hover:bg-gray-750 shadow-md hover:shadow-xl'
          : 'border-gray-300 hover:border-blue-400 bg-white/50 hover:bg-blue-50 shadow-sm hover:shadow-lg'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className={`w-20 h-20 mb-5 rounded-full flex items-center justify-center transition-all duration-300
        ${
          isDark
            ? 'bg-blue-600/20 group-hover:bg-blue-600/30'
            : 'bg-blue-100 group-hover:bg-blue-200'
        }`}>
        <Plus className={`w-10 h-10 ${
          isDark ? 'text-blue-400' : 'text-blue-600'
        } group-hover:scale-110 transition-transform duration-300`} />
      </div>

      <h3 className={`font-extrabold text-xl mb-2 tracking-wide ${
        isDark ? 'text-gray-100 group-hover:text-blue-300' : 'text-gray-900 group-hover:text-blue-600'
      } transition-colors duration-200`}>
        Add New Exam
      </h3>

      <p className={`text-sm ${
        isDark ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Create a new exam allocation project effortlessly.
      </p>
    </div>
  );
};

export default AddExamCard;