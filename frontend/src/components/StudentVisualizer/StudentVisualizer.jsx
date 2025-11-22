// src/components/StudentVisualizer/StudentVisualizer.jsx (Fixed)
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useStudentStore } from '../../stores/studentStore';
import { useStudentAnalyzerStore } from '../../Stores/studentAnalyzerStore';
import { useEnhancedStudentGroups } from '../../hooks/useEnhancedStudentGroups';
import ExcelUploader from './ExcelUploader';
import StickmanAvatar from './StickmanAvatar';
import CameraController from './CameraController';
import FilterPanel from './FilterPanel';
import Tooltip3D from './Tooltip3D';
import LoadingSpinner from '../UI/LoadingSpinner';
import StudentAnalyzerPanel from '../StudentAnalyzer/StudentAnalyzerPanel';

const StudentVisualizer = () => {
  const { students, loading, error, groupBy, hoveredStudent, selectedStudent } = useStudentStore();
  const { setAnalyzerOpen, hoveredGroup } = useStudentAnalyzerStore();
  const { groups, statistics } = useEnhancedStudentGroups(students, groupBy);

  if (loading) {
    return (
      <div className="min-w-screen min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoadingSpinner size="lg" message="Loading student data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-w-screen min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!students || !students.length) {
    return (
      <div className="min-w-screen min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Student Details Visualizer</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Upload an Excel file to visualize student data in an interactive 3D environment
          </p>
        </div>
        <ExcelUploader />
      </div>
    );
  }

  return (
    <div className="min-w-screen min-h-screen relative bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Enhanced Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">Student Visualizer</h1>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div>
                <span className="font-semibold">{students.length}</span> Students
              </div>
              <div>
                <span className="font-semibold">{statistics.totalGroups}</span> Groups
              </div>
              <div className="flex items-center space-x-2">
                <span>Mode:</span>
                <span className="font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                  {useStudentAnalyzerStore.getState().currentGrouping.type.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Analyzer Toggle Button */}
            <button
              onClick={() => setAnalyzerOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>🎯</span>
              <span>Open Analyzer</span>
            </button>
            
            <button
              onClick={() => useStudentStore.getState().reset()}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="absolute top-20 left-6 z-10">
        <FilterPanel />
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 top-16 bottom-0">
        <Canvas
          shadows
          camera={{ position: [15, 10, 15], fov: 50 }}
          gl={{ antialias: true }}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            {/* Enhanced lighting for better group visualization */}
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={0.8}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <pointLight position={[0, 10, 0]} intensity={0.5} />

            <Environment preset="city" />
            
            {/* Camera Controller with idle animation */}
            <CameraController />
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={5}
              maxDistance={50}
            />

            {/* Enhanced Group Rendering with hover effects */}
            {groups && groups.map((group) => (
              <group key={group.key} position={[group.position.x, 0, group.position.z]}>
                {/* Enhanced Group Floor Marker with hover effect */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                  <circleGeometry args={[3.5, 32]} />
                  <meshBasicMaterial 
                    color={group.color} 
                    transparent 
                    opacity={hoveredGroup === group.key ? 0.3 : 0.1}
                  />
                </mesh>

                {/* Pulsing effect for hovered groups */}
                {hoveredGroup === group.key && (
                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
                    <ringGeometry args={[3.5, 4.5, 32]} />
                    <meshBasicMaterial 
                      color={group.color}
                      transparent
                      opacity={0.2}
                    />
                  </mesh>
                )}

                {/* Enhanced Group Label */}
                <mesh position={[0, 0.5, -4]}>
                  <planeGeometry args={[5, 1]} />
                  <meshBasicMaterial 
                    color={group.color}
                    transparent
                    opacity={0.9}
                  />
                </mesh>

                {/* Students in this group */}
                {group.students && group.students.map((student, index) => {
                  const angle = (index / group.students.length) * Math.PI * 2;
                  // Radius scales slightly with group size so they don't overlap
                  const radius = 2 + Math.min(group.students.length * 0.25, 6);
                  const x = Math.cos(angle) * radius;
                  const z = Math.sin(angle) * radius;

                  return (
                    <StickmanAvatar
                      key={student.id}
                      student={student}
                      position={[x, 0, z]}
                      color={group.color}
                      isHighlighted={hoveredGroup === group.key}
                    />
                  );
                })}
              </group>
            ))}

            {hoveredStudent && <Tooltip3D student={hoveredStudent} />}
          </Suspense>
        </Canvas>
      </div>

      {/* Student Analyzer Panel */}
      <StudentAnalyzerPanel />

      {/* Enhanced Statistics Footer - FIXED: Safe access to groupDistribution */}
      <div className="absolute bottom-6 left-6 z-10 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{statistics.totalStudents} Total Students</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>{statistics.totalGroups} Active Groups</span>
          </div>
          {/* FIX: Safe access to groupDistribution */}
          {statistics.groupDistribution && Object.entries(statistics.groupDistribution).slice(0, 3).map(([name, count]) => (
            <div key={name} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>{name}: {count} students</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="absolute bottom-6 right-6 z-10 flex space-x-3">
        <button
          onClick={() => useStudentStore.getState().setCameraOrbitEnabled(
            !useStudentStore.getState().cameraOrbitEnabled
          )}
          className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-gray-200 hover:bg-white transition-colors text-sm font-medium text-gray-700"
        >
          {useStudentStore.getState().cameraOrbitEnabled ? '⏸️ Pause Orbit' : '▶️ Resume Orbit'}
        </button>
      </div>
    </div>
  );
};

export default StudentVisualizer;