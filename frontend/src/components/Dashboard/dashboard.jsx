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
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
    .fromTo('.header-section',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' },
      '-=0.4'
    )
    .fromTo('.recent-exam-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo('.exam-card',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.7)' },
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

  const deleteExam = (examIdToDelete) => {
    const updatedExams = exams.filter(exam => exam.id !== examIdToDelete);
    setExams(updatedExams);
    localStorage.setItem('exams', JSON.stringify(updatedExams));

    const updatedRecentExams = recentExams.filter(exam => exam.id !== examIdToDelete);
    setRecentExams(updatedRecentExams);
    localStorage.setItem('recentExams', JSON.stringify(updatedRecentExams));
  };


  if (!isLoaded) {
    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`dashboard-page min-h-screen transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100'
        : 'bg-gradient-to-br from-white to-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <Header />

        {recentExams.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-4 mb-8">
              <h2 className={`text-2xl font-bold tracking-tight ${
                isDark ? 'text-gray-100' : 'text-gray-800'
              }`}>
                Recently Accessed
              </h2>
              <div className={`h-0.5 flex-1 rounded-full ${
                isDark ? 'bg-gray-800' : 'bg-gray-200'
              }`}></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentExams.map((exam) => (
                <div
                  key={`recent-${exam.id}`}
                  className={`recent-exam-card p-5 rounded-2xl border transition-all duration-300 cursor-pointer group hover:shadow-lg ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 hover:border-blue-600/50 hover:bg-gray-700'
                      : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-white shadow-sm'
                  }`}
                  onClick={() => openExam(exam.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full flex-shrink-0 ${
                      isDark ? 'bg-blue-600/20' : 'bg-blue-100'
                    }`}>
                      <svg className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-lg truncate ${
                        isDark ? 'text-gray-100 group-hover:text-blue-300' : 'text-gray-900 group-hover:text-blue-600'
                      } transition-colors duration-200`}>
                        {exam.name}
                      </h3>
                      <p className={`text-sm mt-1 ${
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
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-2xl font-bold tracking-tight ${
              isDark ? 'text-gray-100' : 'text-gray-900'
            }`}>
              All Exams
            </h2>
            <div className={`text-md font-medium px-4 py-2 rounded-full ${
              isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}>
              {exams.length} exam{exams.length !== 1 ? 's' : ''}
            </div>
          </div>

          <ExamGrid
            exams={exams}
            onExamClick={openExam}
            onExamDelete={deleteExam}
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