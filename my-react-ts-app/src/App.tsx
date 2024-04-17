import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Profile from './Profile';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import VerifyOTP from './components/VerifyOTP';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import React, { useState, useEffect } from 'react';
import './index.css'

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);




  const handleLogin = () => {
    setIsLoggedIn(true);
    // Update isLoggedIn state after successful login
  };

  useEffect(() => {
    console.log('Token in sessionStorage:', sessionStorage.getItem('Token'));
  console.log('userID in sessionStorage:', sessionStorage.getItem('UserID'));
  const token = sessionStorage.getItem('Token');
  const storedUserID = sessionStorage.getItem('userID');
    console.log('isLoggedIn:', isLoggedIn); // Log the initial value of isLoggedIn
  }, []); // Empty dependency array ensures it only runs once when the component mounts

  useEffect(() => {
    // Check if userId exists in session storage
    const token = sessionStorage.getItem('Token');
    if (token) {
      // Perform additional checks on the token, if necessary, on the server-side
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  
  return (
    <Router>
      <Routes>
        {/* Protected Route */}
        <Route path="/profile/:userID" element={<Profile />} />
        
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/verifyotp" element={<VerifyOTP />} />
        
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to={isLoggedIn ? `/profile/${sessionStorage.getItem('UserID')}` : '/login'} />} />
      </Routes>
    </Router>
  );
};

export default App;
