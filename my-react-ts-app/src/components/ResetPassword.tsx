import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/ResetPassword.css';

import logo from './logo-no-background.png'; // Your logo file

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleUpdateClick = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setErrorMessage('Invalid or missing token. Please request a new password reset.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/resetpassword`, { token, password });
      const msg = response.data.message;
      if (msg === 'Password reset successfully') {
        setErrorMessage('');
        setSuccessMessage('Password has been reset successfully. You will be redirected to the login page.');
        setTimeout(() => {
          navigate('/login');
        }, 3000); // Redirect after 3 seconds
      } else {
        setErrorMessage(msg);
      }
    } catch (error: any) {
      console.error('Password reset error:', error.message || 'Unknown error');
      setErrorMessage('Failed to reset password. Please try again later.');
    }
  };

  return (
    <div
      className="reset-password-page"
      style={{
        backgroundColor: '#1c1c1e',
        minHeight: '100vh',
        color: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Navbar */}
      <BootstrapNavbar bg="dark" variant="dark" fixed="top" className="custom-navbar">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Logo" style={{ height: '25px', width: 'auto' }} />
          </a>
        </div>
      </BootstrapNavbar>

      {/* Reset Password Form */}
      <div
        className="reset-password-box shadow-lg p-5 rounded"
        style={{
          backgroundColor: '#2d2d30',
          borderRadius: '12px',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          padding: '40px',
        }}
      >
        <h2
          className="text-center mb-4"
          style={{
            color: '#4CAF50',
            fontFamily: "'Roboto Slab', serif",
            fontSize: '1.5rem',
            fontWeight: 700,
          }}
        >
          Reset Password
        </h2>

        {/* New Password */}
        <div className="mb-4">
          <div className="password-input-group input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              value={password}
              placeholder="Enter New Password*"
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                borderRadius: '8px',
                border: '1px solid #444',
                backgroundColor: '#1c1c1e',
                color: '#f5f5f5',
                padding: '12px',
              }}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={togglePasswordVisibility}
              style={{
                borderRadius: '8px',
                border: '1px solid #444',
                backgroundColor: '#444',
                color: '#f5f5f5',
                padding: '0.5rem 1rem',
              }}
            >
              <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`} />
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <div className="password-input-group input-group">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="form-control"
              value={confirmPassword}
              placeholder="Confirm Password*"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                borderRadius: '8px',
                border: '1px solid #444',
                backgroundColor: '#1c1c1e',
                color: '#f5f5f5',
                padding: '12px',
              }}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={toggleConfirmPasswordVisibility}
              style={{
                borderRadius: '8px',
                border: '1px solid #444',
                backgroundColor: '#444',
                color: '#f5f5f5',
                padding: '0.5rem 1rem',
              }}
            >
              <i className={`fas ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`} />
            </button>
          </div>
        </div>

        {/* Error and Success Messages */}
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
        {successMessage && <p className="text-success">{successMessage}</p>}

        {/* Update Button */}
        <div className="d-grid gap-2">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleUpdateClick}
            style={{
              backgroundColor: '#4CAF50',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              transition: 'all 0.3s',
            }}
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
