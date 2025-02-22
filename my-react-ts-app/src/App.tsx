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
import Subscription from './components/auth/Subscription';
import TemplatesPage from './components/Temp/TemplatesPage';
import ResumeBuilder from './components/profile-photo/AIResumeGenerate';
import { ThemeProvider } from "./components/ThemeProvider";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import LandingPage from './components/LandingPage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useUserId } from './components/useUserId';
import { ProtectedRoute } from './components/ProtectedRoute';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const userId = useUserId();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoggedIn(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes with Auth Check */}
          <Route 
            path="/login" 
            element={
              <ProtectedRoute requireAuth={false}>
                <LoginForm onLogin={() => {}} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <ProtectedRoute requireAuth={false}>
                <RegisterForm />
              </ProtectedRoute>
            } 
          />
          
          {/* Public Routes */}
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/verifyOTP" element={<VerifyOTP />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/templates" element={<TemplatesPage />} />

          {/* Protected Routes */}
          <Route 
            path="/profile/:userID" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/ai-portfolio/:userID" 
            element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/:uid/resumebuild" 
            element={
              <ProtectedRoute>
                <ResumeBuilder />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/subscription" 
            element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/ai-cover-letter/:userID" 
            element={
              <ProtectedRoute>
                <CoverLetter />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
