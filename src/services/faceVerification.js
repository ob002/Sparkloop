<<<<<<< HEAD
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
<<<<<<< HEAD

// Optional: Face++ keys
const FACEPP_API_KEY = import.meta.env.VITE_FACEPP_API_KEY || null;
const FACEPP_API_SECRET = import.meta.env.VITE_FACEPP_API_SECRET || null;
const FACEPP_COMPARE_URL = "https://api-us.faceplusplus.com/facepp/v3/compare";

// Convert base64
const imageToBase64 = (imageData) => imageData.split(",")[1];

// ✅ Upload selfie (only if user chooses to verify)
export const uploadSelfie = async (userId, imageData) => {
  if (!imageData) return null;

  try {
    const selfieRef = ref(storage, `selfies/${userId}_${Date.now()}.jpg`);
    await uploadString(selfieRef, imageData, "data_url");
    return await getDownloadURL(selfieRef);
  } catch (error) {
    console.error("Selfie upload error:", error);
    return null;
  }
};

// ✅ Compare faces (only if user chooses verification)
export const compareFaces = async (image1Data, image2URL) => {
  if (!FACEPP_API_KEY || !FACEPP_API_SECRET) {
    return {
      matched: false,
      confidence: 0,
      details: "Verification disabled",
    };
  }

  try {
    const formData = new FormData();
    formData.append("api_key", FACEPP_API_KEY);
    formData.append("api_secret", FACEPP_API_SECRET);
    formData.append("image_base64_1", imageToBase64(image1Data));
    formData.append("image_url2", image2URL);

    const res = await fetch(FACEPP_COMPARE_URL, { method: "POST", body: formData });
    const data = await res.json();

    if (data.error_message) throw new Error(data.error_message);

    const confidence = data.confidence || 0;
    return {
      matched: confidence >= 80,
      confidence,
      details: data,
    };
  } catch (err) {
    console.error("Compare error:", err);
    return { matched: false, confidence: 0 };
  }
};

// ✅ OPTIONAL VERIFICATION CONTROLLER
export const verifyUserIdentity = async (userId, selfieData, profilePhotoURL) => {
  try {
    // ✅ If user CHOOSES NOT to verify → Save minimal state & allow them in
    if (!selfieData) {
      await updateDoc(doc(db, "users", userId), {
        verified: false,
        verificationSkipped: true,
        verificationAttemptedAt: new Date(),
      });

      return {
        success: true,
        confidence: 0,
        message: "Verification skipped. You can verify later anytime.",
        skipped: true,
      };
    }

    // ✅ User DID verify
    const selfieURL = await uploadSelfie(userId, selfieData);
    const result = await compareFaces(selfieData, profilePhotoURL);

    await updateDoc(doc(db, "users", userId), {
      verified: result.matched,
      verificationAttemptedAt: new Date(),
      verificationConfidence: result.confidence,
      selfieURL,
      verificationSkipped: false,
    });

    return {
      success: result.matched,
      confidence: result.confidence,
      message: result.matched
        ? "Verification successful!"
        : "Verification failed. Try again.",
      skipped: false,
    };
  } catch (error) {
    console.error("Identity verification error:", error);
    return {
      success: false,
      message: "Verification failed due to an error.",
      skipped: false,
    };
  }
};

// Camera permission
export const checkCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((t) => t.stop());
    return true;
  } catch {
=======
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
=======

// Optional: Face++ keys
const FACEPP_API_KEY = import.meta.env.VITE_FACEPP_API_KEY || null;
const FACEPP_API_SECRET = import.meta.env.VITE_FACEPP_API_SECRET || null;
const FACEPP_COMPARE_URL = "https://api-us.faceplusplus.com/facepp/v3/compare";

// Convert base64
const imageToBase64 = (imageData) => imageData.split(",")[1];
>>>>>>> 81fdaea (update)

// ✅ Upload selfie (only if user chooses to verify)
export const uploadSelfie = async (userId, imageData) => {
  if (!imageData) return null;

  try {
    const selfieRef = ref(storage, `selfies/${userId}_${Date.now()}.jpg`);
<<<<<<< HEAD
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
=======
    await uploadString(selfieRef, imageData, "data_url");
    return await getDownloadURL(selfieRef);
  } catch (error) {
    console.error("Selfie upload error:", error);
    return null;
  }
};

// ✅ Compare faces (only if user chooses verification)
export const compareFaces = async (image1Data, image2URL) => {
  if (!FACEPP_API_KEY || !FACEPP_API_SECRET) {
    return {
      matched: false,
      confidence: 0,
      details: "Verification disabled",
    };
  }

  try {
    const formData = new FormData();
    formData.append("api_key", FACEPP_API_KEY);
    formData.append("api_secret", FACEPP_API_SECRET);
    formData.append("image_base64_1", imageToBase64(image1Data));
    formData.append("image_url2", image2URL);

    const res = await fetch(FACEPP_COMPARE_URL, { method: "POST", body: formData });
    const data = await res.json();

    if (data.error_message) throw new Error(data.error_message);
>>>>>>> 81fdaea (update)

    const confidence = data.confidence || 0;
    return {
<<<<<<< HEAD
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
=======
      matched: confidence >= 80,
      confidence,
      details: data,
    };
  } catch (err) {
    console.error("Compare error:", err);
    return { matched: false, confidence: 0 };
  }
};

// ✅ OPTIONAL VERIFICATION CONTROLLER
export const verifyUserIdentity = async (userId, selfieData, profilePhotoURL) => {
  try {
    // ✅ If user CHOOSES NOT to verify → Save minimal state & allow them in
    if (!selfieData) {
      await updateDoc(doc(db, "users", userId), {
        verified: false,
        verificationSkipped: true,
        verificationAttemptedAt: new Date(),
      });

      return {
        success: true,
        confidence: 0,
        message: "Verification skipped. You can verify later anytime.",
        skipped: true,
      };
    }

    // ✅ User DID verify
>>>>>>> 81fdaea (update)
    const selfieURL = await uploadSelfie(userId, selfieData);
    const result = await compareFaces(selfieData, profilePhotoURL);

<<<<<<< HEAD
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
>>>>>>> f0ad6cfda9215423e9e6159d340c95e9e075098a
=======
    await updateDoc(doc(db, "users", userId), {
      verified: result.matched,
      verificationAttemptedAt: new Date(),
      verificationConfidence: result.confidence,
      selfieURL,
      verificationSkipped: false,
    });

    return {
      success: result.matched,
      confidence: result.confidence,
      message: result.matched
        ? "Verification successful!"
        : "Verification failed. Try again.",
      skipped: false,
    };
  } catch (error) {
    console.error("Identity verification error:", error);
    return {
      success: false,
      message: "Verification failed due to an error.",
      skipped: false,
    };
  }
};

// Camera permission
export const checkCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((t) => t.stop());
    return true;
  } catch {
>>>>>>> 81fdaea (update)
    return false;
  }
};

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 81fdaea (update)
// Capture selfie
export const captureImageFromVideo = (videoElement) => {
  const canvas = document.createElement("canvas");
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoElement, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.95);
};
=======
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
>>>>>>> f0ad6cfda9215423e9e6159d340c95e9e075098a
