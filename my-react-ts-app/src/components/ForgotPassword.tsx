import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import '../css/ForgotPassword.css'; // Import custom CSS

import logo from './logo-no-background.png'; // Your logo file

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isResetLinkSent, setIsResetLinkSent] = useState(false);
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleSendClick = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/forgotpassword`, { email });
      const msg = response.data.message;
      localStorage.setItem('Email', email);

      if (msg === 'Reset Password email sent') {
        setIsResetLinkSent(true);
        setErrorMessage('');
      } else {
        setErrorMessage(msg);
        setIsResetLinkSent(false);
      }
    } catch (error: any) {
      console.error('Verification error:', error.message || 'Unknown error');
    }
  };

  return (
    <div className="forgot-password-page">
      <BootstrapNavbar bg="dark" variant="dark" fixed="top" className="custom-navbar">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Logo" height="40" />
          </a>
        </div>
      </BootstrapNavbar>

      <div className="forgot-password-container">
        <div className="forgot-password-box shadow p-5 rounded">
          <h2 className="text-center mb-4">Forgot your Password?</h2>
          <p className="text-center mb-4">Enter your email address to receive a password reset link.</p>
          <div className="mb-4">
            <input
              type="email"
              className="form-control"
              placeholder="Email Address*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {isResetLinkSent && <p className="text-success mt-3">Reset Password Link has been sent!</p>}
            {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
          </div>
          <div className="d-grid gap-2">
            <button type="button" className="btn btn-primary btn-lg" onClick={handleSendClick}>
              Send
            </button>
          </div>
          <div className="text-center mt-4">
            <p>Don't have an account?</p>
            <button type="button" className="btn btn-outline-primary" onClick={handleRegisterClick}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
