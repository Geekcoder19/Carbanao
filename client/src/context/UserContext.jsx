
import React, { createContext, useContext, useState } from "react";

// Create Context
const UserContext = createContext();

// Hook for easy access
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Logged in or registered user
  const [userAnswers, setUserAnswers] = useState(new Map()); // Their question answers

  // ✅ Function to register user + answers
  const registerUser = (userData, answers = new Map()) => {
    setUser(userData);
    setUserAnswers(answers);
    console.log("🧠 Global User Data:", userData);
    console.log("🧠 Global User Answers:", Object.fromEntries(answers));
  };

  // ✅ Function to logout user
  const logoutUser = () => {
    setUser(null);
    setUserAnswers(new Map());
    console.log("🚪 User logged out, global data cleared.");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userAnswers,
        registerUser,
        logoutUser, // ✅ Added this
        setUser,
        setUserAnswers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


































