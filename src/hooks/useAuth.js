import { useState } from 'react';
import { compareFaces, detectFace } from '../services/facePlusPlus';

export const useFaceCompare = () => {
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState(null);

  const compareImages = async (image1Base64, image2Base64) => {
    setComparing(true);
    setError(null);

    try {
      // First, detect faces in both images
      const [detection1, detection2] = await Promise.all([
        detectFace(image1Base64),
        detectFace(image2Base64)
      ]);

      if (!detection1.hasFace) {
        throw new Error('No face detected in the first image');
      }

      if (!detection2.hasFace) {
        throw new Error('No face detected in the second image');
      }

      // Compare the faces
      const comparison = await compareFaces(image1Base64, image2Base64);

      setComparing(false);
      return {
        success: true,
        confidence: comparison.confidence,
        isMatch: comparison.isMatch,
        thresholds: comparison.thresholds
      };
    } catch (err) {
      setError(err.message);
      setComparing(false);
      return {
        success: false,
        error: err.message
      };
    }
  };

  return {
    compareImages,
    comparing,
    error
  };
};