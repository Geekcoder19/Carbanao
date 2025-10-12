
import React, { useState } from 'react';
import Layout from './routing/Layout';
import WebRoutes from './routing/WebRoutes';
import { Leva } from "leva";

export default function App() {
  // 🔹 State to store logged-in user
  const [user, setUser] = useState(localStorage.getItem("user") || null);

  // 🔹 Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    console.log("User logged out");
  };

  return (
    <>
      <Layout>
        {/* 🔹 Pass user, setUser, and handleLogout to WebRoutes */}
        <WebRoutes user={user} setUser={setUser} handleLogout={handleLogout} />
      </Layout>

      <Leva collapsed />
    </>
  );
}
