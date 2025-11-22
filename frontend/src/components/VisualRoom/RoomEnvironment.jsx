// src/components/VisualRoom/RoomEnvironment.jsx
import React from 'react';
import { Environment, Sky, Sparkles } from '@react-three/drei';

/**
 * Enhanced room environment with better lighting and atmosphere
 */
const RoomEnvironment = () => {
  return (
    <group>
      {/* Enhanced Lighting Setup */}
      <ambientLight intensity={0.6} color="#ffffff" />
      
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        color="#ffffff"
      />
      
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
        color="#e0f2fe"
      />
      
      <pointLight
        position={[0, 5, 0]}
        intensity={0.4}
        color="#f0f9ff"
        distance={15}
      />

      {/* Fill light for better visibility */}
      <hemisphereLight
        skyColor="#ffffff"
        groundColor="#eeeeee"
        intensity={0.3}
      />

      {/* Environment Map with fallback */}
      <Environment 
        preset="apartment"
        background={false}
      />
      
      {/* Subtle Sky */}
      <Sky 
        distance={100} 
        sunPosition={[5, 1, 8]} 
        inclination={0} 
        azimuth={0.25}
        turbidity={8}
        rayleigh={6}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      {/* Decorative Sparkles */}
      <Sparkles
        count={30}
        scale={[20, 10, 20]}
        size={1.5}
        speed={0.3}
        opacity={0.1}
        color="#ffffff"
      />

      {/* Fog for depth */}
      <fog attach="fog" args={['#f0f9ff', 15, 25]} />
    </group>
  );
};

export default RoomEnvironment;