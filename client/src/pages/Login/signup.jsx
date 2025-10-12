

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import SignupQuestions from "./SignupQuestions";

export default function Register() {
  const [showQuestions, setShowQuestions] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { registerUser } = useUser();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3001/register", {
        username,
        password,
        email,
      });

      if (res.data.status === "success") {
        registerUser(res.data.user, new Map());
        setShowQuestions(true);
      } else {
        alert(res.data.message || "Registration failed");
      }
    } catch (err) {
      console.error("❌ Registration error:", err);
      alert("Registration failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mapping of frontend keys to backend-safe keys
  const questionMapping = {
    "Past Modifications": "pastModifications",
    "Bodykit_Spoiler": "bodykitSpoiler",
    "custom paint or wrap": "customPaintWrap",
    "Past_custom paint/wrap": "pastCustomPaintWrap",
    "New_rims/Tyre": "newRimsTyre",
    "Past_RimsTyre": "pastRimsTyre",
    "performance enhancements": "performanceEnhancements",
    "smart features": "smartFeatures",
  };

  // ✅ When user finishes questions
  const handleQuestionsComplete = async (answers) => {
    const mappedAnswers = {};
    answers.forEach((value, key) => {
      const cleanKey = questionMapping[key];
      if (cleanKey) mappedAnswers[cleanKey] = value;
    });

    // ✅ Save answers globally
    registerUser({ username, email }, answers);

    // ✅ Send to backend with email (important fix)
    try {
      await axios.post("http://localhost:3001/update-answers", {
        email,
        ...mappedAnswers,
      });
      console.log("✅ Answers sent to backend successfully!");
    } catch (err) {
      console.error("❌ Failed to send answers to backend:", err);
    }

    navigate("/login");
  };

  if (showQuestions) {
    return <SignupQuestions onComplete={handleQuestionsComplete} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-600 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create Account
        </h1>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 mb-3">Already have an account?</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
