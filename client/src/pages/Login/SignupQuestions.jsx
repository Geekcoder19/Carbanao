


import React, { useState } from "react";

export default function SignupQuestions({ onComplete }) {
  const questions = [
    "Past Modifications",
    "Bodykit_Spoiler",
    "custom paint or wrap",
    "Past_custom paint/wrap",
    "New_rims/Tyre",
    "Past_RimsTyre",
    "performance enhancements",
    "smart features",
  ];

  const [answers, setAnswers] = useState(new Map());

  const handleAnswer = (key, value) => {
    const updated = new Map(answers);
    updated.set(key, value);
    setAnswers(updated);
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    if (answers.size !== questions.length) {
      alert("Please answer all questions before finishing.");
      return;
    }
    console.log("✅ Sending these answers (as object):", Object.fromEntries(answers));
    if (onComplete) onComplete(answers);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-500 to-blue-600 p-6 text-white">
      <div className="bg-white text-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Tell us about your interests
        </h2>
        {questions.map((q) => (
          <div key={q} className="mb-4">
            <p className="font-medium mb-2">{q.replace(/_/g, " ")}</p> {/* Cleans up display text */}
            <div className="flex gap-4">
              <button
                // ✅ Ensure value is the number 1
                onClick={() => handleAnswer(q, 1)}
                className={`flex-1 py-2 rounded-lg font-semibold border ${
                  answers.get(q) === 1
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 hover:bg-green-100"
                }`}
              >
                Yes
              </button>
              <button
                // ✅ Ensure value is the number 0
                onClick={() => handleAnswer(q, 0)}
                className={`flex-1 py-2 rounded-lg font-semibold border ${
                  answers.get(q) === 0
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 hover:bg-red-100"
                }`}
              >
                No
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold mt-4"
        >
          Finish
        </button>
      </div>
    </div>
  );
}