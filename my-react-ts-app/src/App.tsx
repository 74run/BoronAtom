import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Profile from './Profile';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import VerifyOTP from './components/VerifyOTP';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import CoverLetter from './components/Cover/AiCoverLetter';
import { useParams } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Initialize isLoggedIn state based on localStorage
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useParams();

  const decode = (token: string) => {
    const payload = token.split('.')[1]; // Assuming token structure: header.payload.signature
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  };
  

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('Token');
      const storedUserID = localStorage.getItem('UserID');
    
      if (!token || !storedUserID) {
        handleLogout();
        return;
      }
  
      // Decode the token (if it's a JWT) to get expiration time
      const decodedToken = decode(token);
      if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
        // Token is expired
        handleLogout();
        return;
      }
  
      // Token is still valid, consider refreshing it if needed
      // For example, you might implement token refresh logic here
    };

    const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(storedIsLoggedIn);
    setIsLoading(false); // Loading is complete
    checkTokenExpiration();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('Token');
    localStorage.removeItem('UserID');
    localStorage.setItem('isLoggedIn', 'false');
  };

  return (
    <Router>
      <Routes>
        {/* Protected Route */}
        <Route
          path="/profile/:userID"
          element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
        />

        

        {/* Public Routes */}
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path= {`/verifyOTP`} element={<VerifyOTP />} />
        <Route path="/ai-cover-letter" element={<CoverLetter />} />

        {/* Default Redirect */}
        <Route
          path="/"
          element={
            isLoading ? (
              <div>Loading...</div>
            ) : isLoggedIn ? (
              <Navigate
                to={`/profile/${localStorage.getItem('UserID') || '/login'}`}
                replace={true}
              />
            ) : (
              <Navigate to="/login" replace={true} />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
