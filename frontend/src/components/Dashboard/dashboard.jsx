import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useTheme } from '../../contexts/ThemeContext';
import Header from './Header';
import ExamGrid from './ExamGrid';
import AddExamModal from './AddExamModal';
import { ParticleCard } from '../MagicBento';

const Dashboard = () => {
  const [exams, setExams] = useState([]);
  const [recentExams, setRecentExams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const { isDark, isLoaded } = useTheme();

  const deleteExam = (examId) => {
    // Remove from exams
    const updatedExams = exams.filter((exam) => exam.id !== examId);
    setExams(updatedExams);
    localStorage.setItem('exams', JSON.stringify(updatedExams));

    // Remove from recent
    const updatedRecent = recentExams.filter((exam) => exam.id !== examId);
    setRecentExams(updatedRecent);
    localStorage.setItem('recentExams', JSON.stringify(updatedRecent));
  };

  const renameExam = (examId, newName) => {
    const updatedExams = exams.map((exam) =>
      exam.id === examId ? { ...exam, name: newName } : exam
    );
    setExams(updatedExams);
    localStorage.setItem('exams', JSON.stringify(updatedExams));

    const updatedRecent = recentExams.map((exam) =>
      exam.id === examId ? { ...exam, name: newName } : exam
    );
    setRecentExams(updatedRecent);
    localStorage.setItem('recentExams', JSON.stringify(updatedRecent));
  };

  useEffect(() => {
    const syncData = () => {
      setExams(JSON.parse(localStorage.getItem('exams')) || []);
      setRecentExams(JSON.parse(localStorage.getItem('recentExams')) || []);
    };

    syncData();
    window.addEventListener('storage', syncData);

    return () => window.removeEventListener('storage', syncData);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const tl = gsap.timeline();

    tl.fromTo(
      '.dashboard-page',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', zIndex: 1 }
    )
      .fromTo(
        '.header-section',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' },
        '-=0.4'
      )
      .fromTo(
        '.recent-section',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      )
      .fromTo(
        '.exam-card',
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
      gsap.fromTo(
        `#exam-${newExam.id}`,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
      );
    }, 100);
  };

  const openExam = (examId) => {
    const exam = exams.find((e) => e.id === examId);
    if (!exam) return;

    const card = document.getElementById(`exam-${examId}`);
    if (!card) return;

    gsap.to(card, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        const updatedExams = exams.map((e) =>
          e.id === examId ? { ...e, lastOpened: new Date().toISOString() } : e
        );
        setExams(updatedExams);
        localStorage.setItem('exams', JSON.stringify(updatedExams));

        gsap.to('.dashboard-page', {
          opacity: 0,
          scale: 0.98,
          duration: 0.4,
          ease: 'power3.in',
          onComplete: () => navigate(`/rooms/${examId}`),
        });
      },
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`dashboard-page min-h-screen w-full transition-all duration-500 ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 text-gray-100'
          : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-gray-100 text-gray-900'
      }`}
    >
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="header-section">
          <Header />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left - Recent Exams */}
          {recentExams.length > 0 && (
            <section className="recent-section lg:w-1/3">
              <div className="top-8">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`p-2 rounded-xl ${
                      isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2
                    className={`text-2xl font-bold ${
                      isDark ? 'text-gray-100' : 'text-gray-800'
                    }`}
                  >
                    Recently Opened
                  </h2>
                </div>

                <div className="space-y-4">
                  {recentExams.map((exam) => (
                    <ParticleCard
                      key={`recent-${exam.id}`}
                      enableTilt
                      clickEffect
                      enableBorderGlow
                      particleCount={4}
                      className="w-full"
                    >
                      <div
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer group backdrop-blur-sm w-full ${
                          isDark
                            ? 'bg-gray-800/60 border-gray-700 hover:border-blue-500/50 hover:bg-gray-800/80 shadow-2xl'
                            : 'bg-white/80 border-gray-200 hover:border-blue-400/50 hover:bg-white shadow-lg'
                        }`}
                        onClick={() => openExam(exam.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${
                              isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                            }`}
                          >
                            <svg
                              className={`w-6 h-6 ${
                                isDark ? 'text-blue-400' : 'text-blue-600'
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`font-semibold truncate text-lg mb-1 ${
                                isDark ? 'text-gray-100' : 'text-gray-900'
                              }`}
                            >
                              {exam.name}
                            </h3>
                            <p
                              className={`text-sm ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            >
                              Last opened{' '}
                              {new Date(exam.lastOpened).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </ParticleCard>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Right - All Exams */}
          <section
            className={`flex-1 ${
              recentExams.length > 0 ? 'lg:w-2/3' : 'w-full'
            }`}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2
                  className={`text-3xl font-bold mb-2 ${
                    isDark ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  Your Exams
                </h2>
                <p
                  className={`text-lg ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {exams.length} exam{exams.length !== 1 ? 's' : ''} • Manage
                  your examination projects
                </p>
              </div>
            </div>

            <ExamGrid
              exams={exams}
              onExamClick={openExam}
              onAddExam={() => setIsModalOpen(true)}
              onDeleteExam={deleteExam}
              onRenameExam={renameExam}
            />
          </section>
        </div>
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
