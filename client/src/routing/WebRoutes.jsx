import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage';
import ContactPage from '../pages/Contact/ContactPage';
import AboutPage from '../pages/About/AboutPage';
import Explore from '../pages/Models/Explore';
import Login from '../pages/Login/login';
import Signup from '../pages/Login/signup';

// ✅ Accept props from App.jsx
export default function WebRoutes({ user, setUser, handleLogout }) {
  return (
    <>
      <Routes>
        {/* ✅ Pass setUser to Login */}
        <Route path='/login' element={<Login setUser={setUser} />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/home' element={<HomePage user={user} handleLogout={handleLogout} />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/Explore' element={<Explore />} />
      </Routes>
    </>
  );
}
