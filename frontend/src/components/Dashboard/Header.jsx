import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
  const { isDark } = useTheme();

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo('.title-letter',
      { opacity: 0, y: 30, rotationX: -90 },
      { opacity: 1, y: 0, rotationX: 0, duration: 0.7, stagger: 0.05, ease: 'back.out(1.7)' }
    )
    .fromTo('.subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.4'
    );

    return () => tl.kill();
  }, []);

  const title = "Exam Dashboard";

  return (
    <header className="header-section text-center mb-16 py-10">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-5 leading-tight">
        {title.split('').map((letter, index) => (
          <span
            key={index}
            className={`title-letter inline-block ${
              isDark
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400'
                : 'text-gray-900'
            }`}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
      </h1>
      <p className={`subtitle text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      }`}>
        Create and manage your exam allocations seamlessly with an intuitive and powerful interface.
      </p>
    </header>
  );
};

export default Header;