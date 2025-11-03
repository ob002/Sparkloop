import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

const FACEPP_API_KEY = import.meta.env.VITE_FACEPP_API_KEY;
const FACEPP_API_SECRET = import.meta.env.VITE_FACEPP_API_SECRET;
const FACEPP_COMPARE_URL = 'https://api-us.faceplusplus.com/facepp/v3/compare';

/**
 * Convert image to base64
 */
const imageToBase64 = (imageData) => {
  return imageData.split(',')[1]; // Remove data:image/jpeg;base64, prefix
};

/**
 * Upload selfie to Firebase Storage
 */
export const uploadSelfie = async (userId, imageData) => {
  try {
    const selfieRef = ref(storage, `selfies/${userId}_${Date.now()}.jpg`);
    await uploadString(selfieRef, imageData, 'data_url');
    const downloadURL = await getDownloadURL(selfieRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading selfie:', error);
    throw error;
  }
};

/**
 * Compare two images using Face++ API
 */
export const compareFaces = async (image1Data, image2URL) => {
  try {
    const formData = new FormData();
    formData.append('api_key', FACEPP_API_KEY);
    formData.append('api_secret', FACEPP_API_SECRET);
    formData.append('image_base64_1', imageToBase64(image1Data));
    formData.append('image_url2', image2URL);

    const response = await fetch(FACEPP_COMPARE_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.error_message) {
      throw new Error(data.error_message);
    }

    // Face++ returns confidence score (0-100)
    // We consider 80+ as a match
    const confidence = data.confidence || 0;
    const threshold = 80;

    return {
      matched: confidence >= threshold,
      confidence: confidence,
      details: data,
    };
  } catch (error) {
    console.error('Error comparing faces:', error);
    throw error;
  }
};

/**
 * Verify user's identity
 */
export const verifyUserIdentity = async (userId, selfieData, profilePhotoURL) => {
  try {
    // Upload selfie to storage
    const selfieURL = await uploadSelfie(userId, selfieData);

    // Compare faces
    const comparisonResult = await compareFaces(selfieData, profilePhotoURL);

    // Update user verification status
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      verified: comparisonResult.matched,
      verificationAttemptedAt: new Date(),
      verificationConfidence: comparisonResult.confidence,
      selfieURL: selfieURL,
    });

    return {
      success: comparisonResult.matched,
      confidence: comparisonResult.confidence,
      message: comparisonResult.matched
        ? 'Verification successful! Your profile is now live.'
        : 'Verification failed. Please ensure your selfie matches your profile photo.',
    };
  } catch (error) {
    console.error('Error verifying user identity:', error);
    throw error;
  }
};

/**
 * Check if user has camera permission
 */
export const checkCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Camera permission error:', error);
    return false;
  }
};

/**
 * Capture image from video stream
 */
export const captureImageFromVideo = (videoElement) => {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoElement, 0, 0);
  
  return canvas.toDataURL('image/jpeg', 0.95);
};