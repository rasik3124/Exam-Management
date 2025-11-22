import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import FloatingLines from './FloatingLines';
import TextType from './TextType';
// import Dashboard from '../components/Dashboard/dashboard'; // Assuming Dashboard is not needed here

const WelcomePage = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const examManagementRef = useRef(null);
  const taglineRef = useRef(null);
  const featuresRef = useRef(null); 
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const [typingComplete, setTypingComplete] = useState(false);
  const [allContentVisible, setAllContentVisible] = useState(false); // Retained for animation timing

  // 1. Initial animation (runs once on mount)
  useEffect(() => {
    const tl = gsap.timeline();

    // Initial container fade in
    tl.fromTo(containerRef.current, 
      { opacity: 0 },
      { 
        opacity: 1, 
        duration: 1.5, 
        ease: 'power2.out' 
      }
    )
    // WELCOME title animation
    .fromTo(titleRef.current,
      { 
        y: 100, 
        opacity: 0,
        scale: 0.8 
      },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        duration: 1.2, 
        ease: 'back.out(1.7)',
      },
      '-=1.0'
    );

    return () => tl.kill();
  }, []);

  // 2. Secondary animation (runs only when typingComplete changes to true)
  useEffect(() => {
    if (typingComplete) {
      animateRemainingElements();
    }
  }, [typingComplete]);

  const animateRemainingElements = () => {
    // Reset opacity of elements that start hidden (handled by GSAP)
    // Note: We're removing the opacity: 0 set for the button here to make it visible instantly
    gsap.set([examManagementRef.current, taglineRef.current], { opacity: 0 });

    const tl = gsap.timeline();
    
    // Exam Management heading animation
    tl.fromTo(examManagementRef.current,
      { 
        y: 50, 
        opacity: 0,
        rotationX: 45 
      },
      { 
        y: 0, 
        opacity: 1, 
        rotationX: 0,
        duration: 1.0, 
        ease: 'back.out(1.5)',
      }
    )
    // Tagline animation
    .fromTo(taglineRef.current,
      { 
        y: 30, 
        opacity: 0 
      },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: 'power2.out' 
      },
      '-=0.6'
    )
    // Button animation (Now a simpler bounce animation for visual appeal)
    .fromTo(buttonRef.current,
      { 
        scale: 0.9, 
        opacity: 0 
      },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 1.2, 
        ease: 'elastic.out(1, 0.5)',
        onComplete: () => setAllContentVisible(true)
      },
      '-=0.2'
    );
  };

  const handleDashboardClick = () => {
    // --- CHANGE 1: Removed `if (!allContentVisible) return;` to allow immediate function ---

    const tl = gsap.timeline();
    // Create ripple element centered inside button
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.8);
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 10;
    `;
    buttonRef.current.appendChild(ripple);

    tl.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      ease: 'power2.in'
    })
    .to(ripple, {
      width: '200%',
      height: '200%',
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => ripple.remove() 
    }, 0) 
    .to(buttonRef.current, {
      scale: 1,
      duration: 0.4,
      ease: 'elastic.out(1.2, 0.5)'
    }, 0.1) 
    .add(() => {
      // Small delay added here to ensure the ripple animation has time to start
      setTimeout(() => navigate('/dashboard'), 200); 
    }, '>');
  };


  const handleTypingComplete = () => {
    setTimeout(() => setTypingComplete(true), 500); 
  };

  return (
    <div 
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#16213E] font-['Inter']"
    >
      
      {/* Premium FloatingLines Background */}
      <div className="absolute inset-0">
        <FloatingLines 
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[12, 18, 24]}
          lineDistance={[6, 4, 2]}
          bendRadius={6.0}
          bendStrength={-0.6}
          interactive={true}
          parallax={true}
          lineColors={['#00EAFE', '#FF1DAE', '#FFED00']}
        />
      </div>

      {/* Animated Particle Overlay */}
      <div className="absolute inset-0 opacity-30">
        {/* Particle component placeholder */}
      </div>

      {/* Main Content Container - Centered */}
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="text-center max-w-6xl mx-auto w-full">
          
          {/* WELCOME Title */}
          <h1 
            ref={titleRef}
            className="mb-8 text-7xl md:text-9xl lg:text-[10rem] font-black text-white tracking-tighter leading-none"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: 'linear-gradient(135deg, #FFFFFF 0%, #A855F7 50%, #00EAFE 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              textShadow: `
                0 0 30px rgba(168, 85, 247, 0.4),
                0 0 60px rgba(168, 85, 247, 0.2),
                0 0 90px rgba(168, 85, 247, 0.1)
              `,
              filter: 'drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3))'
            }}
          >
            WELCOME
          </h1>

          {/* TextType with Premium Styling */}
          <div className="mb-16 h-24 flex items-center justify-center">
            <div 
              className="text-3xl md:text-5xl lg:text-6xl font-medium text-[#F3F3F3]"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                textShadow: `
                  0 0 20px rgba(0, 234, 254, 0.4),
                  0 0 40px rgba(0, 234, 254, 0.2)
                `
              }}
            >
              <TextType
                text={[
                  "Exam Management System",
                  "Smart Room Planner", 
                  "Student Allocation Tool",
                  "Automated Seating",
                  "Efficient Exam Scheduling"
                ]}
                typingSpeed={60}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="▊"
                cursorColor="#00EAFE"
                onComplete={handleTypingComplete}
              />
            </div>
          </div>

          {/* Exam Management Heading */}
          <div 
            ref={examManagementRef} 
            className="mb-12" 
          >
            <h2 
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-6"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 50%, #F59E0B 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                filter: 'drop-shadow(0 5px 15px rgba(168, 85, 247, 0.3))'
              }}
            >
              Exam Management
            </h2>
          </div>

          {/* Premium Tagline */}
          <div 
            ref={taglineRef} 
            className="mb-16"
          >
            <p 
              className="text-2xl md:text-3xl lg:text-4xl text-[#E2E8F0] max-w-4xl mx-auto leading-relaxed font-light mb-8"
              style={{
                fontFamily: "'Poppins', sans-serif",
                lineHeight: '1.6',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}
            >
              Streamline your examination process with intelligent management and seamless automation
            </p>
          </div>

          {/* Premium Features Grid (retained for layout spacing) */}
          <div 
            ref={featuresRef}
            className="mb-20"
          >
          </div>

          {/* Premium CTA Button */}
          <div className="flex justify-center">
            <button
              ref={buttonRef}
              onClick={handleDashboardClick}
              // --- CHANGE 2: Removed conditional logic and `disabled` prop ---
              className={`group relative px-20 py-6 text-2xl font-black text-white rounded-2xl overflow-hidden transition-all duration-700 
                hover:scale-105 hover:shadow-[0_0_60px_rgba(255,26,174,0.8)] cursor-pointer`}
              style={{
                // Ensured button remains bright and functional
                background: 'linear-gradient(135deg, #FF1DAE 0%, #A855F7 50%, #00EAFE 100%)',
                fontFamily: "'Space Grotesk', sans-serif",
                boxShadow: '0 0 40px rgba(255, 26, 174, 0.4)',
                border: '2px solid transparent',
                backgroundSize: '200% 200%',
                // Use a default animation for continuous brightness
                animation: 'gradientShift 3s ease infinite'
              }}
              // Removed disabled={!allContentVisible}
            >
              {/* CSS for gradient animation */}
              <style jsx>{`
                @keyframes gradientShift {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                .animate-fade-in {
                  animation: fadeIn 1s ease-out forwards;
                }
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(20px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>

              {/* Multi-layer Glow Effects - Kept for brightness */}
              <span className="button-glow absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FF1DAE]/50 via-[#A855F7]/40 to-[#00EAFE]/50 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></span>
              
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-white/10 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"></span>

              {/* Animated Border - Kept for brightness */}
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FF1DAE] via-[#A855F7] to-[#00EAFE] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'exclude',
                  padding: '2px'
                }}
              ></span>

              {/* Main Content */}
              <span className="relative z-10 flex items-center justify-center gap-4">
                <span className="text-3xl transition-transform duration-300 group-hover:rotate-12">
                  🚀
                </span>
                Launch Dashboard
                <span className="text-3xl transition-all duration-500 group-hover:translate-x-2 group-hover:scale-110">
                  →
                </span>
              </span>

              {/* Hover Light Sweep */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></span>
            </button>
          </div>

          {/* Premium Footer Note */}
          {/* Footer now displays immediately after button animation finishes */}
          {allContentVisible && (
            <div className="mt-16 animate-fade-in">
              <p className="text-lg text-[#94A3B8] font-light tracking-wide"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
                }}
              >
                Trusted by 500+ educational institutions worldwide
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Background Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(0, 234, 254, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 40% 80%, rgba(255, 26, 174, 0.1) 0%, transparent 50%)
          `
        }}
      ></div>
    </div>
  );
};

export default WelcomePage;