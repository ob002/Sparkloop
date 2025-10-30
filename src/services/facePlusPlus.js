import axios from 'axios';

// TODO: Replace with your Face++ credentials
const API_KEY = 'YOUR_FACE_PLUS_PLUS_API_KEY';
const API_SECRET = 'YOUR_FACE_PLUS_PLUS_API_SECRET';
const BASE_URL = 'https://api-us.faceplusplus.com/facepp/v3';

export const compareFaces = async (image1Base64, image2Base64) => {
  try {
    const formData = new FormData();
    formData.append('api_key', API_KEY);
    formData.append('api_secret', API_SECRET);
    formData.append('image_base64_1', image1Base64);
    formData.append('image_base64_2', image2Base64);

    const response = await axios.post(`${BASE_URL}/compare`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return {
      confidence: response.data.confidence,
      thresholds: response.data.thresholds,
      isMatch: response.data.confidence >= 80 // 80% similarity threshold
    };
  } catch (error) {
    console.error('Face comparison error:', error);
    throw new Error('Failed to compare faces. Please try again.');
  }
};

export const detectFace = async (imageBase64) => {
  try {
    const formData = new FormData();
    formData.append('api_key', API_KEY);
    formData.append('api_secret', API_SECRET);
    formData.append('image_base64', imageBase64);

    const response = await axios.post(`${BASE_URL}/detect`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return {
      faceCount: response.data.faces ? response.data.faces.length : 0,
      hasFace: response.data.faces && response.data.faces.length === 1
    };
  } catch (error) {
    console.error('Face detection error:', error);
    throw new Error('Failed to detect face. Please try again.');
  }
};