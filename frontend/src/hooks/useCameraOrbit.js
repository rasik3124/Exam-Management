// src/hooks/useCameraOrbit.js
import { useEffect, useRef } from 'react';
import { useStudentStore } from '../stores/studentStore';

export const useCameraOrbit = () => {
  const { userActive, cameraOrbitEnabled, setUserActive } = useStudentStore();
  const lastActivityTime = useRef(Date.now());
  const inactivityTimeoutRef = useRef();

  // Track user activity
  useEffect(() => {
    const handleUserActivity = () => {
      lastActivityTime.current = Date.now();
      setUserActive(true);
      
      // Clear existing timeout
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      
      // Set new timeout for inactivity
      inactivityTimeoutRef.current = setTimeout(() => {
        setUserActive(false);
      }, 5000); // 5 seconds
    };

    // Add event listeners
    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, [setUserActive]);

  return { userActive, cameraOrbitEnabled };
};