import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Profile from './components/profile/Profile';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import VerifyOTP from './components/auth/VerifyOTP';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import CoverLetter from './components/Cover/AiCoverLetter';
import Portfolio from './components/Portfolio/portfolio';
import { useParams } from 'react-router-dom';
import HomePage from './components/HomePage';

import ResumeBuilder from './components/profile-photo/AIResumeGenerate';

import { ThemeProvider } from "./components/ThemeProvider";

import PDFHTML from './components/resume/PDFHTML'
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

  const refreshToken = async () => {
    try {
      const response = await fetch('/refresh-token', { method: 'POST', credentials: 'include' });
      const data = await response.json();
      
      if (data.accessToken) {
        localStorage.setItem('Token', data.accessToken); // Or store it securely as per your choice
        return true;
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
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
    // Clear all items from localStorage
    localStorage.clear();
  
    // Optionally, set 'isLoggedIn' to false explicitly, in case you want to keep control over it in your state
    setIsLoggedIn(false);
  };
  
  return (
    <ThemeProvider>
    <Router>
      <Routes>
        {/* Protected Route */}
        <Route
          path="/profile/:userID"
          element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
        />

    {/* <Route path="/" element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />} /> */}

        {/* <Route path = "/" element={<HomePage />} /> */}

        <Route path="/ai-portfolio/:userID" element={isLoggedIn ? <Portfolio /> : <Navigate to="/login" />} />

     <Route
    path="/"
    element={isLoggedIn ? <Navigate to={`/profile/${localStorage.getItem('UserID')}`} /> : <Navigate to="/login" replace />}
  />
  <Route path ="/:userID/resumebuild" element ={<ResumeBuilder />}/>
        
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path= {`/verifyOTP`} element={<VerifyOTP />} />
        <Route path="/ai-cover-letter/:userID" element={isLoggedIn ?<CoverLetter /> : <Navigate to="/login" />} />

        {/* Default Redirect */}
        {/* <Route
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
        /> */}
      </Routes>
    </Router>
    </ThemeProvider>
  );
};

export default App;
