// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import WelcomePage from './pages/Welcome';
import Dashboard from './components/Dashboard/dashboard';
import Navbar from './components/Navbar';
import RoomsPage from './pages/Rooms';
import RoomBuilder from './components/RoomBuilder';
import StudentVisualizer from './components/StudentVisualizer/StudentVisualizer'
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ErrorBoundary>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Conditional Navbar - not shown on welcome page */}
            <Routes>
              <Route path="/" element={null} />
              <Route path="*" element={<Navbar />} />
            </Routes>
            
            <main>
              <Routes>
                {/* Welcome page as the initial entry point */}
                <Route path="/" element={<WelcomePage />} />
                
                {/* Dashboard page */}
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Room Builder page */}
                <Route path="/room-builder" element={<RoomBuilder />} />
                <Route path="/student" element={<StudentVisualizer />} /> 
                {/* Existing pages */}
                <Route path="/rooms/:examId" element={<RoomsPage />} />
                
                {/* Redirect /allocate to room-builder for better naming */}
                <Route path="/allocate" element={<Navigate to="/room-builder" replace />} />
                
                {/* Redirect any unknown routes to dashboard */}
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