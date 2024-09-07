import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import '../css/VerifyOTP.css'; // Import your custom CSS file
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

import logo from './logo-no-background.png';

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      setErrorMessage('User ID is missing. Please register again.');
    }
  }, [userId]);

  const handleVerification = async () => {
    if (!userId) {
      setErrorMessage('User ID is missing. Please try again.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/verifyOTP`, {
        otp,
        userId // Pass userId from local storage
      });
      const { message } = response.data;
  
      if (response.data.success) {
        localStorage.removeItem('userId'); // Clear userId from local storage after successful verification
        navigate('/login');
      } else {
        setErrorMessage(message || 'Verification failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Verification error:', error.message || 'Unknown error');
      setErrorMessage('An error occurred during verification. Please try again.');
    }
  };

  const handleResendOTP = async () => {
    if (!userId) {
      setErrorMessage('User ID is missing. Please try again.');
      return;
    }

    setIsResending(true); // Indicate that the OTP is being resent

    try {
      const response = await axios.post(`${API_BASE_URL}/api/resendOTP`, { userId });
      const { message } = response.data;

      if (response.data.success) {
        setSuccessMessage('OTP has been resent. Please check your email.');
      } else {
        setErrorMessage(message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Resend OTP error:', error.message || 'Unknown error');
      setErrorMessage('An error occurred while resending the OTP. Please try again.');
    } finally {
      setIsResending(false); // Reset the resending state
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="verify-page">
      <BootstrapNavbar bg="dark" variant="dark" fixed="top" className="custom-navbar">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Logo" height="40" />
          </a>
          <Nav className="ms-auto">
            <Nav.Link onClick={handleLoginClick}>Login</Nav.Link>
            <Nav.Link onClick={handleRegisterClick}>Register</Nav.Link>
          </Nav>
        </div>
      </BootstrapNavbar>

      <div className="verify-container d-flex justify-content-center align-items-center">
        <div className="verify-box shadow-lg p-5 rounded">
          <h2 className="text-center mb-4">Verify Your Account</h2>
          <p className="text-center mb-4">Enter the OTP sent to your email</p>
          <div className="mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={{
                borderRadius: "8px",
                border: "1px solid #444",
                backgroundColor: "#1c1c1e",
                color: "#f5f5f5",
                padding: "12px",
              }}
            />
          </div>
          <div className="d-grid gap-2">
            <button onClick={handleVerification} className="btn btn-primary btn-lg" style={{ backgroundColor: "#4CAF50", border: "none", padding: "10px 20px", borderRadius: "8px" }}>
              Verify
            </button>
          </div>

          <div className="mt-3 text-center">
            <button onClick={handleResendOTP} className="btn btn-link" disabled={isResending}>
              {isResending ? 'Resending...' : 'Resend OTP'}
            </button>
          </div>

          {successMessage && <p className="text-success mt-3 text-center">{successMessage}</p>}
          {errorMessage && <p className="text-danger mt-3 text-center">{errorMessage}</p>}
        </div>
      </div>

      <style>{`
        .verify-page {
          background-color: #1c1c1e;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #f5f5f5;
          font-family: 'Roboto', sans-serif;
          padding-top: 80px; /* Adjust for navbar */
        }

        .verify-container {
          max-width: 500px;
          width: 100%;
          margin: auto;
          padding: 20px;
        }

        .verify-box {
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
          border-color: #4CAF50;
        }

        .btn-link {
          color: #007bff;
        }

        .btn-link:hover {
          color: #0056b3;
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

export default VerifyOTP;
