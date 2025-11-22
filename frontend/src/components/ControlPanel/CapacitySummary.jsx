// src/components/ControlPanel/CapacitySummary.jsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Enhanced capacity summary with proper GSAP cleanup
 */
const CapacitySummary = ({ totalBenches, totalRoomCapacity, maxBenches, isExpanded }) => {
  const benchesRef = useRef(null);
  const capacityRef = useRef(null);
  const prevBenches = useRef(totalBenches);
  const prevCapacity = useRef(totalRoomCapacity);
  
  // Store GSAP animations for cleanup
  const animationsRef = useRef([]);

  // Animate number changes with proper cleanup
  useEffect(() => {
    if (benchesRef.current) {
      const animation = gsap.to(prevBenches, {
        current: totalBenches,
        duration: 0.5,
        onUpdate: () => {
          // Check if ref still exists before updating
          if (benchesRef.current) {
            benchesRef.current.textContent = Math.round(prevBenches.current);
          }
        },
        ease: "power2.out"
      });
      
      animationsRef.current.push(animation);
      
      // Cleanup function
      return () => {
        if (animation) {
          animation.kill();
        }
      };
    }
  }, [totalBenches]);

  useEffect(() => {
    if (capacityRef.current) {
      const animation = gsap.to(prevCapacity, {
        current: totalRoomCapacity,
        duration: 0.5,
        onUpdate: () => {
          // Check if ref still exists before updating
          if (capacityRef.current) {
            capacityRef.current.textContent = Math.round(prevCapacity.current);
          }
        },
        ease: "power2.out"
      });
      
      animationsRef.current.push(animation);
      
      // Cleanup function
      return () => {
        if (animation) {
          animation.kill();
        }
      };
    }
  }, [totalRoomCapacity]);

  // Cleanup all animations on unmount
  useEffect(() => {
    return () => {
      animationsRef.current.forEach(animation => {
        if (animation) {
          animation.kill();
        }
      });
      animationsRef.current = [];
    };
  }, []);

  const utilizationPercentage = Math.round((totalBenches / maxBenches) * 100);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-2 h-6 bg-purple-600 rounded-full"></div>
        <h2 className="text-lg font-semibold text-gray-800">Capacity Summary</h2>
      </div>
      
      <div className={`grid gap-4 ${isExpanded ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {/* Total Benches Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <div className="bg-blue-500 p-2 rounded-lg">
              <span className="text-white text-lg">🪑</span>
            </div>
            <div className="text-sm font-medium text-blue-700">Total Benches</div>
          </div>
          <div className="text-2xl font-bold text-blue-900" ref={benchesRef}>
            {totalBenches}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            of {maxBenches} maximum
          </div>
        </div>

        {/* Room Capacity Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <div className="bg-green-500 p-2 rounded-lg">
              <span className="text-white text-lg">👥</span>
            </div>
            <div className="text-sm font-medium text-green-700">Room Capacity</div>
          </div>
          <div className="text-2xl font-bold text-green-900" ref={capacityRef}>
            {totalRoomCapacity}
          </div>
          <div className="text-xs text-green-600 mt-1">
            total people
          </div>
        </div>
      </div>

      {/* Grid Utilization */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-700 mb-2">
          <span className="font-medium">Grid Utilization</span>
          <span className="font-bold text-blue-700">{utilizationPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-700 ease-out shadow-inner"
            style={{ width: `${utilizationPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Empty</span>
          <span>Full</span>
        </div>
      </div>

      {/* Efficiency Indicator */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Space Efficiency:</span>
          <span className={`text-sm font-semibold ${
            utilizationPercentage >= 80 ? 'text-green-600' : 
            utilizationPercentage >= 50 ? 'text-yellow-600' : 'text-gray-600'
          }`}>
            {utilizationPercentage >= 80 ? 'Excellent' : 
             utilizationPercentage >= 50 ? 'Good' : 'Can Improve'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CapacitySummary;