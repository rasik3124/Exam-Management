// src/components/VisualRoom/VisualRoom.jsx
import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Sky, Sparkles, Html } from '@react-three/drei';
import BenchEntity from './BenchEntity';
import EnhancedGround from './EnhancedGround';
import RoomEnvironment from './RoomEnvironment';
import CameraControls from './CameraControls';

/**
 * Error Boundary for 3D Scene
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Scene Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-sm">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              3D Scene Error
            </h3>
            <p className="text-red-600 text-sm mb-4">
              There was an issue loading the 3D scene. Using fallback rendering.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </Html>
      );
    }

    return this.props.children;
  }
}

// helper: camera presets
const getCameraPreset = (view) => {
  const presets = {
    overhead: { position: [0, 10, 0], fov: 50 },
    side:     { position: [10, 4, 0], fov: 50 },
    corner:   { position: [8, 5, 8],  fov: 45 },
    front:    { position: [0, 5, 10], fov: 50 },
  };
  return presets[view] || presets.overhead;
};

// this runs inside Canvas to actually update camera when view changes
const CameraRig = ({ cameraView }) => {
  const { camera } = useThree();

  useEffect(() => {
    const preset = getCameraPreset(cameraView);
    camera.position.set(
      preset.position[0],
      preset.position[1],
      preset.position[2]
    );
    camera.fov = preset.fov;
    camera.updateProjectionMatrix();
  }, [cameraView, camera]);

  return null;
};

/**
 * Enhanced visual room with improved environment and layout
 */
const VisualRoom = ({
  roomConfig,
  benches,
  onAddBench,
  onRemoveBench,
  isPanelExpanded,
  mode = 'builder', // "builder" or "preview"
}) => {
  const [cameraView, setCameraView] = useState('overhead');
  const [autoOrbit, setAutoOrbit] = useState(false);
  const canvasRef = useRef();
  const [sceneError, setSceneError] = useState(null);

  const isPreview = mode === 'preview';
  const canAddBench =
    !isPreview && roomConfig.roomName && benches.length < (roomConfig.rows * roomConfig.cols);

  const cameraPreset = getCameraPreset(cameraView);

  return (
    <div className="relative w-full h-full flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-md border-b rounded-lg border-gray-400 p-3/2">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-sm sm:text-base md:text-lg px-3 font-bold text-gray-800">
              {roomConfig.roomName || 'Untitled Room'}
            </h1>
            <p className="text-[11px] sm:text-xs text-gray-600">
              {benches.length} benches • {benches.length * roomConfig.benchCapacity} capacity
            </p>
          </div>

          <CameraControls
            cameraView={cameraView}
            onViewChange={setCameraView}
            mode={isPreview ? 'preview' : 'builder'}
            autoOrbit={autoOrbit}
            onToggleOrbit={() => setAutoOrbit((prev) => !prev)}
          />
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        ref={canvasRef}
        shadows
        className="w-full h-full"
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        camera={cameraPreset}
        onCreated={({ gl }) => {
          gl.setClearColor('#f0f9ff');
        }}
      >
        <CameraRig cameraView={cameraView} />

        <ErrorBoundary>
          <Suspense fallback={<FallbackScene />}>
            <RoomEnvironment />

            {/* Enhanced Ground */}
            <EnhancedGround rows={roomConfig.rows} cols={roomConfig.cols} />

            {/* Benches */}
            <group position={[0, 0.1, 0]}>
              {benches.map((bench) => (
                <BenchEntity
                  key={bench.id}
                  bench={bench}
                  rows={roomConfig.rows}
                  cols={roomConfig.cols}
                  onRemove={() => onRemoveBench(bench.id)}
                  mode={mode}   // ✅ pass preview/builder mode
                />
              ))}
            </group>

            {/* Grid System */}
            <GridSystem rows={roomConfig.rows} cols={roomConfig.cols} />

            {/* Orbit Controls */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={3}
              maxDistance={20}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 1.8}
              target={[0, 0, 0]}
              makeDefault
              autoRotate={autoOrbit}
              autoRotateSpeed={0.5}
            />
          </Suspense>
        </ErrorBoundary>
      </Canvas>

      {/* Floating Action Button – only in builder */}
      {canAddBench && (
        <div className="absolute bottom-6 right-6 z-10">
          <button
            onClick={onAddBench}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-3 rounded-2xl shadow-2xl font-semibold text-sm sm:text-base transition-all duration-200 hover:shadow-3xl hover:scale-105 flex items-center space-x-2 group"
          >
            <div className="bg-white/20 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
              <span className="text-xl">+</span>
            </div>
            <span>Add Bench</span>
          </button>
        </div>
      )}

      {/* Grid Status */}
      <div className="absolute bottom-3 left-3 z-10 bg-black/70 text-white px-3 py-2 rounded-2xl backdrop-blur-sm">
        <div className="text-[11px]">
          Grid: {roomConfig.rows}×{roomConfig.cols} • {benches.length}/
          {roomConfig.rows * roomConfig.cols} filled
        </div>
        <div className="text-[10px] text-gray-300 mt-1">
          Capacity: {benches.length * roomConfig.benchCapacity} people
        </div>
      </div>

      {/* Scene Controls Help – keep small */}
      <div className="absolute top-25 right-1 z-10 bg-black/60 text-white px-2 py-1.5 rounded-xl backdrop-blur-sm text-[10px]">
        <div className="font-medium mb-0.5">Controls:</div>
        <div>Drag - Rotate</div>
        <div>Scroll - Zoom</div>
        <div>Right Drag - Pan</div>
      </div>

      {/* Empty State */}
      {!roomConfig.roomName && <EmptyState />}

      {/* Loading State */}
      {benches.length === 0 && roomConfig.roomName && !isPreview && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Build</h3>
            <p className="text-gray-600 text-sm">
              Click the &quot;Add Bench&quot; button to start placing benches in your room.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};


/**
 * Grid system for better spatial awareness
 */
const GridSystem = ({ rows, cols }) => {
  const gridSize = Math.max(rows, cols) * 2.5;
  
  return (
    <group>
      <gridHelper 
        args={[gridSize, gridSize, '#3b82f6', '#3b82f6']} 
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        material-transparent
        material-opacity={0.2}
      />
      
      {/* Grid boundaries */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[gridSize, gridSize]} />
        <meshBasicMaterial 
          color="#3b82f6" 
          transparent 
          opacity={0.05}
          wireframe={false}
        />
      </mesh>
    </group>
  );
};

/**
 * Enhanced loading fallback scene
 */
const FallbackScene = () => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={0.8} 
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Fallback ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#f8fafc"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Fallback grid */}
      <gridHelper 
        args={[20, 20, '#cbd5e1', '#cbd5e1']} 
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.45, 0]}
      />
      
      {/* Loading indicator */}
      <Html center>
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-700">Loading 3D Scene...</p>
        </div>
      </Html>
    </>
  );
};

/**
 * Enhanced empty state component
 */
const EmptyState = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="bg-white/95 p-8 rounded-3xl shadow-2xl text-center max-w-md border border-gray-200 transform hover:scale-105 transition-transform duration-300">
        <div className="text-6xl mb-4 animate-bounce">🏗️</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Design Your Perfect Room</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Start by giving your room a name in the control panel, then add benches to create your ideal learning or meeting space.
        </p>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="text-blue-600 text-lg">💡</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-blue-800 mb-1">Quick Tips:</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Name your room to enable bench placement</li>
                <li>• Adjust grid size for different room layouts</li>
                <li>• Use camera controls to view from different angles</li>
                <li>• Set bench capacity based on your needs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualRoom;  