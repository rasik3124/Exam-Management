import { useState, useEffect } from 'react';

export const useSystemChecks = ({ examId, selectedDayId }) => {
  const [status, setStatus] = useState('running');
  const [checks, setChecks] = useState([
    { id: 'students', label: 'Loading student files', description: 'Processing student registration data', status: 'pending' },
    { id: 'validation', label: 'Validating registration numbers', description: 'Checking format and completeness', status: 'pending' },
    { id: 'subjects', label: 'Matching subjects with timetable', description: 'Aligning course codes and schedules', status: 'pending' },
    { id: 'duplicates', label: 'Checking for duplicates', description: 'Identifying duplicate registrations', status: 'pending' },
    { id: 'requirements', label: 'Calculating seat requirements', description: 'Computing total seating needs', status: 'pending' },
    { id: 'capacity', label: 'Validating room capacity', description: 'Comparing requirements with available space', status: 'pending' },
    { id: 'language', label: 'Verifying language constraints', description: 'Checking special accommodation needs', status: 'pending' },
    { id: 'final', label: 'Final system verification', description: 'Completing pre-allocation checks', status: 'pending' }
  ]);

  useEffect(() => {
    let currentIndex = 0;
    const totalChecks = checks.length;

    const runNextCheck = () => {
      if (currentIndex >= totalChecks) {
        // All checks completed
        const hasErrors = checks.some(check => check.status === 'error');
        const hasWarnings = checks.some(check => check.status === 'warning');
        
        setStatus(hasErrors ? 'attention' : hasWarnings ? 'attention' : 'success');
        return;
      }

      // Simulate API call delay
      const delay = Math.random() * 400 + 400; // 400-800ms

      setTimeout(() => {
        setChecks(prev => {
          const updated = [...prev];
          
          // Set current check to running
          updated[currentIndex] = {
            ...updated[currentIndex],
            status: 'running'
          };
          
          return updated;
        });

        // Simulate completion after running
        setTimeout(() => {
          setChecks(prev => {
            const updated = [...prev];
            let newStatus = 'success';
            let details = null;

            // Simulate some checks failing for demo purposes
            if (updated[currentIndex].id === 'capacity') {
              // Always show capacity error for demo
              newStatus = 'error';
              details = 'Capacity shortage: 480 students but only 450 seats available';
            } else if (updated[currentIndex].id === 'duplicates') {
              // Show warning for duplicates
              newStatus = 'warning';
              details = '3 potential duplicate entries found';
            } else if (updated[currentIndex].id === 'language') {
              newStatus = 'success';
              details = '2 special accommodations identified';
            }

            updated[currentIndex] = {
              ...updated[currentIndex],
              status: newStatus,
              details
            };

            return updated;
          });

          currentIndex++;
          runNextCheck();
        }, 600);
      }, delay);
    };

    runNextCheck();
  }, [examId, selectedDayId]);

  const hasBlockingErrors = checks.some(check => check.status === 'error');
  const hasWarnings = checks.some(check => check.status === 'warning');

  return {
    status,
    checks,
    hasBlockingErrors,
    hasWarnings
  };
};