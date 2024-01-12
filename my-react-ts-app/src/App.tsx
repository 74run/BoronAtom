// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Profile from './Profile';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import VerifyOTP from './components/VerifyOTP';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

import './index.css'


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />}></Route>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/verifyotp" element={<VerifyOTP />} />
        <Route path="/profile/:userID" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
