// src/components/StudentVisualizer/CameraController.jsx
import { useFrame } from '@react-three/fiber';
import { useCameraOrbit } from '../../hooks/useCameraOrbit';

const CameraController = () => {
  const { userActive, cameraOrbitEnabled } = useCameraOrbit();

  useFrame((state) => {
    if (cameraOrbitEnabled && !userActive) {
      const t = state.clock.getElapsedTime();
      state.camera.position.x = Math.sin(t * 0.2) * 15;
      state.camera.position.z = Math.cos(t * 0.2) * 15;
      state.camera.position.y = 5 + Math.sin(t * 0.1) * 2;
      state.camera.lookAt(0, 0, 0);
    }
  });

  return null;
};

export default CameraController;