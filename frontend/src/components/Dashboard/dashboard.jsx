// src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useTheme } from '../../contexts/ThemeContext';
import Header from './Header';
import ExamGrid from './ExamGrid';
import AddExamModal from './AddExamModal';

const Dashboard = () => {
  const [exams, setExams] = useState([]);
  const [recentExams, setRecentExams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isDark, isLoaded } = useTheme();

  useEffect(() => {
    const savedExams = JSON.parse(localStorage.getItem('exams')) || [];
    setExams(savedExams);
    
    const recent = JSON.parse(localStorage.getItem('recentExams')) || [];
    setRecentExams(recent);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    
    const tl = gsap.timeline();
    
    tl.fromTo('.dashboard-page', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
    .fromTo('.header-section',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' },
      '-=0.3'
    )
    .fromTo('.exam-card',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(1.7)' },
      '-=0.2'
    );

    return () => tl.kill();
  }, [isLoaded]);

  const addExam = (examName) => {
    const newExam = {
      id: Date.now().toString(),
      name: examName,
      createdAt: new Date().toISOString(),
      lastOpened: new Date().toISOString(),
    };

    const updatedExams = [newExam, ...exams];
    setExams(updatedExams);
    localStorage.setItem('exams', JSON.stringify(updatedExams));
    
    const updatedRecent = [newExam, ...recentExams].slice(0, 3);
    setRecentExams(updatedRecent);
    localStorage.setItem('recentExams', JSON.stringify(updatedRecent));

    setTimeout(() => {
      gsap.fromTo(`#exam-${newExam.id}`,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }, 100);
  };

  const openExam = (examId) => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) return;

    const card = document.getElementById(`exam-${examId}`);
    gsap.to(card, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        const updatedExams = exams.map(e => 
          e.id === examId ? { ...e, lastOpened: new Date().toISOString() } : e
        );
        setExams(updatedExams);
        localStorage.setItem('exams', JSON.stringify(updatedExams));

        gsap.to('.dashboard-page', {
          opacity: 0,
          scale: 0.98,
          duration: 0.3,
          ease: 'power3.in',
          onComplete: () => navigate(`/rooms/${examId}`)
        });
      }
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`dashboard-page min-h-screen min-w-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-6 py-8">
        <Header />
        
        {recentExams.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className={`text-xl font-semibold ${
                isDark ? 'text-gray-100' : 'text-gray-800'
              }`}>
                Recently Opened
              </h2>
              <div className={`h-px flex-1 ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentExams.map((exam) => (
                <div
                  key={`recent-${exam.id}`}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer group ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-750'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => openExam(exam.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                    }`}>
                      <svg className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium truncate ${
                        isDark ? 'text-gray-100' : 'text-gray-900'
                      }`}>
                        {exam.name}
                      </h3>
                      <p className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Opened {new Date(exam.lastOpened).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${
              isDark ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Your Exams
            </h2>
            <div className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {exams.length} exam{exams.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <ExamGrid
            exams={exams}
            onExamClick={openExam}
            onAddExam={() => setIsModalOpen(true)}
          />
        </section>
      </div>

      <AddExamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddExam={addExam}
      />
    </div>
  );
};

export default Dashboard;