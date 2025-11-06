import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase.js";

const FACEPP_API_KEY = import.meta.env.VITE_FACEPP_API_KEY;
const FACEPP_API_SECRET = import.meta.env.VITE_FACEPP_API_SECRET;
const FACEPP_COMPARE_URL = "https://api-us.faceplusplus.com/facepp/v3/compare";

/**
 * Convert data URL image to base64 (remove prefix)
 */
const imageToBase64 = (imageData) => {
  return imageData.split(",")[1];
};

/**
 * Upload selfie to Firebase Storage
 */
export const uploadSelfie = async (userId, imageData) => {
  try {
    const selfieRef = ref(storage, `selfies/${userId}_${Date.now()}.jpg`);

    // Upload base64 string
    await uploadString(selfieRef, imageData, "data_url");

    // Get download link
    return await getDownloadURL(selfieRef);
  } catch (error) {
    console.error("Error uploading selfie:", error);
    throw error;
  }
};

/**
 * Compare selfies using Face++
 */
export const compareFaces = async (image1Data, profilePhotoURL) => {
  try {
    const formData = new FormData();
    formData.append("api_key", FACEPP_API_KEY);
    formData.append("api_secret", FACEPP_API_SECRET);
    formData.append("image_base64_1", imageToBase64(image1Data));
    formData.append("image_url2", profilePhotoURL);

    const response = await fetch(FACEPP_COMPARE_URL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.error_message) {
      throw new Error(data.error_message);
    }

    const confidence = data.confidence ?? 0;
    const matched = confidence >= 80;

    return {
      matched,
      confidence,
      details: data,
    };
  } catch (error) {
    console.error("Error comparing faces:", error);
    throw error;
  }
};

/**
 * Full Identity Verification Flow
 */
export const verifyUserIdentity = async (
  userId,
  selfieData,
  profilePhotoURL
) => {
  try {
    // Upload selfie
    const selfieURL = await uploadSelfie(userId, selfieData);

    // Compare with profile image
    const comparisonResult = await compareFaces(selfieData, profilePhotoURL);

    // Update Firestore user doc
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      verified: comparisonResult.matched,
      verificationAttemptedAt: new Date(),
      verificationConfidence: comparisonResult.confidence,
      selfieURL,
    });

    return {
      success: comparisonResult.matched,
      confidence: comparisonResult.confidence,
      selfieURL,
      message: comparisonResult.matched
        ? "Verification successful! Your profile is now live."
        : "Verification failed. Please ensure your selfie matches the profile photo.",
    };
  } catch (error) {
    console.error("Verification error:", error);
    throw error;
  }
};

/**
 * Check Camera Permission
 */
export const checkCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch (error) {
    console.error("Camera permission error:", error);
    return false;
  }
};

/**
 * Capture a frame from video element
 */
export const captureImageFromVideo = (videoElement) => {
  const canvas = document.createElement("canvas");
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoElement, 0, 0);

  return canvas.toDataURL("image/jpeg", 0.95);
};
