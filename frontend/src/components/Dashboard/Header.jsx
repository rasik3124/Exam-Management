// src/components/Dashboard/Header.jsx
import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
  const { isDark } = useTheme();

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo('.title-letter',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: 'back.out(1.7)' }
    )
    .fromTo('.subtitle',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.2'
    );

    return () => tl.kill();
  }, []);

  const title = "Exam Dashboard";
  
  return (
    <header className="header-section text-center mb-12 py-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        {title.split('').map((letter, index) => (
          <span
            key={index}
            className={`title-letter inline-block ${
              isDark 
                ? 'text-gray-100' 
                : 'text-gray-900'
            }`}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
      </h1>
      <p className={`subtitle text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${
        isDark ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Create and manage your exam allocations seamlessly.
      </p>
    </header>
  );
};

export default Header;