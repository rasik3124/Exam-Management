import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../../contexts/ThemeContext'
import { X } from 'lucide-react';

const AddExamModal = ({ isOpen, onClose, onAddExam }) => {
  const [examName, setExamName] = useState('');
  const modalRef = useRef();
  const overlayRef = useRef();
  const { isDark } = useTheme();

  useEffect(() => {
    if (isOpen) {
      const tl = gsap.timeline();
      tl.set(modalRef.current, { display: 'flex' })
        .fromTo(overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 }
        )
        .fromTo(modalRef.current,
          { opacity: 0, scale: 0.85, y: 50 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' },
          '-=0.2'
        );
    }
  }, [isOpen]);

  const handleClose = () => {
    const tl = gsap.timeline();
    tl.to(modalRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 20,
      duration: 0.25,
      ease: 'power2.in'
    })
    .to(overlayRef.current, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        onClose();
        setExamName('');
      }
    }, '-=0.15');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (examName.trim()) {
      onAddExam(examName.trim());
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={handleClose}
      />

      <div
        ref={modalRef}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
        onClick={handleClose}
      >
        <div
          className={`rounded-3xl p-7 sm:p-8 max-w-md w-full shadow-2xl border ${
            isDark
              ? 'bg-gray-850 border-gray-700 text-gray-100'
              : 'bg-white border-gray-200 text-gray-900'
          } transform transition-all duration-300`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className={`text-2xl font-bold tracking-tight ${
              isDark ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Create New Exam
            </h2>
            <button
              onClick={handleClose}
              aria-label="Close modal"
              className={`p-2 rounded-xl transition-colors duration-200 ${
                isDark
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="exam-name" className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Exam Name
              </label>
              <input
                id="exam-name"
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="e.g., 'Mathematics Midterm 2024'"
                className={`w-full px-5 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-blue-500/30 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                }`}
                autoFocus
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-3">
              <button
                type="button"
                onClick={handleClose}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors duration-200 ${
                  isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-gray-100'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-800'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!examName.trim()}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Create Exam
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddExamModal;