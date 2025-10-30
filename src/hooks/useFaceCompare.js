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
```

---

## 📝 PHASE 13: Environment Variables & Configuration

**File: `.env.example`**
```
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Face++ API
VITE_FACE_PLUS_PLUS_API_KEY=your_face_plus_plus_api_key
VITE_FACE_PLUS_PLUS_API_SECRET=your_face_plus_plus_api_secret
```

**File: `.gitignore`**
```
# Dependencies
node_modules/
functions/node_modules/

# Build
dist/
build/

# Environment
.env
.env.local
.env.production

# Firebase
.firebase/
firebase-debug.log
firestore-debug.log
ui-debug.log

# Editor
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/