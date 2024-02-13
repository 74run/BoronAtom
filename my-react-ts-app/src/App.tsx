// frontend/src/App.tsx

import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Profile from './Profile';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import VerifyOTP from './components/VerifyOTP';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import React, { useState, useEffect } from 'react';
import './index.css'


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if userId exists in session storage
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      // Perform any additional checks here if needed
      setIsLoggedIn(true);
    }
  }, []);

  // Function to handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    // Perform logout logic (e.g., clear session storage)
    // Set isLoggedIn to false
    setIsLoggedIn(false);
  };
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to={isLoggedIn ? '/profile/:userID' : '/login'} />} />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/verifyotp" element={<VerifyOTP />} />
        {isLoggedIn && <Route path="/profile/:userID" element={<Profile />} />}
      </Routes>
    </Router>
  );
};

export default App;
