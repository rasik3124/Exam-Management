// src/components/VisualRoom/AddBenchButton.jsx
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * Floating action button for adding benches
 */
const AddBenchButton = ({ onAddBench }) => {
  const buttonRef = useRef();

  // Entrance animation
  useEffect(() => {
    if (buttonRef.current) {
      gsap.fromTo(buttonRef.current, 
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.6, 
          ease: "back.out(1.7)" 
        }
      );
    }
  }, []);

  const handleClick = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: onAddBench
      });
    } else {
      onAddBench();
    }
  };

  return (
    <div 
      ref={buttonRef}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
    >
      <button
        onClick={handleClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl shadow-2xl font-semibold text-lg transition-all duration-200 hover:shadow-3xl hover:scale-105 flex items-center space-x-2"
      >
        <span className="text-2xl">+</span>
        <span>Add Bench</span>
      </button>
    </div>
  );
};

export default AddBenchButton;