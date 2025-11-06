import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Loader, CheckCircle, XCircle } from "lucide-react";

import { useAuth } from "../hooks/useAuth.js";
import SelfieCapture from "../components/verifcation/SelfieCapture.jsx";
import { verifyUserIdentity } from "../services/faceVerification.js";

import { db } from "../services/firebase.js";
import { doc, updateDoc } from "firebase/firestore";

const Verify = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);

  // ✅ Main logic for verification + skip
  const handleSelfieCapture = async (imageData) => {
    // ✅ SKIP VERIFICATION
    if (imageData === null) {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          verificationSkipped: true,
          verified: false,
        });

        return navigate("/discover");
      } catch (error) {
        console.error("Skip Verification Error:", error);
        setResult({
          success: false,
          message: "Could not skip verification. Try again.",
        });
        return;
      }
    }

    // ✅ NORMAL VERIFICATION
    if (!user?.uid || !profile?.photoURL) {
      setResult({
        success: false,
        message: "Missing profile or user data.",
      });
      return;
    }

    setVerifying(true);

    try {
      const data = await verifyUserIdentity(
        user.uid,
        imageData,
        profile.photoURL
      );

      setResult(data);

      if (data.success) {
        await updateDoc(doc(db, "users", user.uid), {
          verified: true,
          verificationSkipped: false,
        });

        setTimeout(() => navigate("/discover"), 1800);
      }
    } catch (e) {
      console.error("Verification error:", e);
      setResult({
        success: false,
        message: "Verification failed. Try again.",
      });
    } finally {
      setVerifying(false);
    }
  };

  // ✅ If profile is still loading
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <Shield className="w-20 h-20 text-white mx-auto mb-4" />
          <h1 className="text-5xl text-white font-bold">Identity Verification</h1>
          <p className="text-white/70">Takes just a few seconds</p>
        </div>

        {/* ✅ CAPTURE UI */}
        {!result && !verifying && (
          <div className="flex flex-col items-center">
            <SelfieCapture
              onCapture={handleSelfieCapture}
              profilePhotoURL={profile.photoURL}
            />

            {/* ✅ SKIP BUTTON */}
            <button
              className="mt-6 text-white bg-gray-500 px-6 py-3 rounded-xl"
              onClick={() => handleSelfieCapture(null)}
            >
              Skip Verification
            </button>
          </div>
        )}

        {/* ✅ LOADING UI */}
        {verifying && (
          <div className="bg-white rounded-3xl p-14 text-center">
            <Loader className="w-16 h-16 text-pink-500 animate-spin mx-auto" />
            <h2 className="text-3xl font-bold mt-6">Verifying...</h2>
            <p className="text-gray-500">Comparing your face…</p>
          </div>
        )}

        {/* ✅ SUCCESS UI */}
        {result?.success && (
          <div className="bg-white rounded-3xl p-14 text-center">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
            <h2 className="text-4xl font-bold mt-6">Verified! 🎉</h2>
            <p className="text-gray-700 mt-4">{result.message}</p>
          </div>
        )}

        {/* ✅ FAILURE UI */}
        {result && !result.success && (
          <div className="bg-white rounded-3xl p-14 text-center">
            <XCircle className="w-24 h-24 text-red-500 mx-auto" />
            <h2 className="text-4xl font-bold mt-6">Verification Failed</h2>
            <p className="text-gray-700 mt-4">{result.message}</p>

            <button
              onClick={() => setResult(null)}
              className="mt-6 px-8 py-3 bg-pink-500 text-white rounded-xl"
            >
              Try Again
            </button>

            {/* ✅ SKIP BUTTON EVEN ON FAIL */}
            <button
              className="mt-4 text-gray-700 underline"
              onClick={() => handleSelfieCapture(null)}
            >
              Skip Verification
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
