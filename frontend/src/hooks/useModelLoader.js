// src/hooks/useModelLoader.js
import { useState, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * Custom hook to load 3D models without causing re-render loops
 */
export const useModelLoader = (url) => {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loader = new GLTFLoader();

    const loadModel = async () => {
      try {
        setLoading(true);
        setError(null);
        
        loader.load(
          url,
          (gltf) => {
            if (mounted) {
              setModel(gltf.scene);
              setLoading(false);
            }
          },
          (progress) => {
            // Optional: handle progress updates
            console.log(`Loading ${url}: ${(progress.loaded / progress.total * 100)}%`);
          },
          (err) => {
            if (mounted) {
              console.error(`Failed to load model: ${url}`, err);
              setError(err);
              setLoading(false);
            }
          }
        );
      } catch (err) {
        if (mounted) {
          console.error(`Error loading model: ${url}`, err);
          setError(err);
          setLoading(false);
        }
      }
    };

    loadModel();

    return () => {
      mounted = false;
    };
  }, [url]);

  return { model, loading, error };
};