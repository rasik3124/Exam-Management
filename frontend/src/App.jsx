// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import WelcomePage from './pages/Welcome';
import Dashboard from './components/Dashboard/dashboard';
import Navbar from './components/Navbar';
import RoomsPage from './components/Rooms/RoomsPage';
import RoomBuilder from './components/RoomBuilder';
import ErrorBoundary from './components/ErrorBoundary';
import AtomicDashboard from './components/Atomic Dashboard/AtomicDashboard';

// Upload components
import StudentUpload from './components/Atomic Dashboard/upload/StudentUpload';
import TimetableUpload from './components/Atomic Dashboard/upload/TimetableUpload';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ErrorBoundary>
          <div className="min-h-screen bg-gray-50 transition-colors duration-300">

            {/* Navbar logic */}
            <Routes>
              <Route path="/" element={null} />
              <Route path="*" element={<Navbar />} />
            </Routes>

            <main>
              <Routes>

                {/* Landing */}
                <Route path="/" element={<WelcomePage />} />

                {/* Old dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Existing features */}
                <Route path="/room-builder/:examId" element={<RoomBuilder />} />
                <Route path="/rooms/:examId" element={<RoomsPage />} />

                {/* Upload student file */}
                <Route path="/student-upload/:examId" element={<StudentUpload />} />

                {/* Upload timetable */}
                <Route path="/timetable-upload/:examId" element={<TimetableUpload />} />

                {/* Atomic Dashboard (direct, no gateway) */}
                <Route path="/atomicdash/:examId" element={<AtomicDashboard />} />

                {/* Allocation redirect fix */}
                <Route path="/allocate/:examId" element={<Navigate to="/room-builder" replace />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />

              </Routes>
            </main>
          </div>
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
}

export default App;
