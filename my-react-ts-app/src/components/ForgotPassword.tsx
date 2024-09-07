import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar } from 'react-bootstrap';
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

  const handleLoginClick = () => {
    navigate('/login');
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
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="forgot-password-page">
      <BootstrapNavbar bg="dark" variant="dark" fixed="top" className="custom-navbar">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Logo" style={{
                  height: "25px",
                  width: "auto",
                }} />
          </a>
        </div>
      </BootstrapNavbar>

      <div className="forgot-password-container d-flex justify-content-center align-items-center">
        <div className="forgot-password-box shadow-lg p-5 rounded">
          <h2 className="text-center mb-4" style={{ fontFamily: "'Roboto Slab', serif", fontSize: "1.5rem", fontWeight: 700, color: "#4CAF50" }}>Forgot your Password?</h2>
          <p className="text-center mb-4">Enter your email address to receive a password reset link.</p>
          <div className="mb-4">
            <input
              type="email"
              className="form-control"
              placeholder="Email Address*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                borderRadius: "8px",
                border: "1px solid #444",
                backgroundColor: "#1c1c1e",
                color: "#f5f5f5",
                padding: "12px",
              }}
            />
            {isResetLinkSent && <p className="text-success mt-3">Reset Password Link has been sent!</p>}
            {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
          </div>
          <div className="d-grid gap-2">
            <button type="button" className="btn btn-primary btn-lg" onClick={handleSendClick} style={{ backgroundColor: "#4CAF50", border: "none", padding: "10px 20px", borderRadius: "8px" }}>
              Send
            </button>
          </div>
          <div className="text-center mt-4">
            <p>Don't have an account?</p>
            <button type="button" className="btn btn-outline-primary" onClick={handleRegisterClick} style={{ borderColor: "#4CAF50", color: "#4CAF50", borderRadius: "8px", transition: "all 0.3s" }}>
              Register
            </button>
          </div>

          <div className="text-center mt-4">
            <p>Already have an account?</p>
            <button type="button" className="btn btn-outline-primary" onClick={handleLoginClick}>
              Login
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .forgot-password-page {
          background-color: #1c1c1e;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #f5f5f5;
          font-family: 'Roboto', sans-serif;
          padding-top: 80px;
        }

        .forgot-password-container {
          max-width: 500px;
          width: 100%;
          margin: auto;
          padding: 20px;
        }

        .forgot-password-box {
          background-color: #2d2d30;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          padding: 40px;
        }

        h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #4CAF50;
          margin-bottom: 20px;
          font-family: 'Roboto Slab', serif;
        }

        p {
          color: #f5f5f5;
        }

        .btn-primary:hover {
          background-color: #45a049;
        }

        .btn-outline-primary:hover {
          background-color: #4CAF50;
          color: white;
        }

        .text-success {
          color: #4CAF50 !important;
        }

        .text-danger {
          color: #dc3545 !important;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
