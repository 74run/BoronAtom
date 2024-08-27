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
    // Extract the token from the URL query parameters
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
        setErrorMessage('');  // Clear any previous error messages
        setSuccessMessage('Password has been reset successfully. You will be redirected to the login page.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);  // Redirect after 3 seconds
      } else {
        setErrorMessage(msg);
      }
    } catch (error: any) {
      console.error('Password reset error:', error.message || 'Unknown error');
      setErrorMessage('Failed to reset password. Please try again later.');
    }
  };

  return (
    <div className="reset-password-page">
      <BootstrapNavbar bg="dark" variant="dark" fixed="top" className="custom-navbar">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Logo" height="40" />
          </a>
        </div>
      </BootstrapNavbar>

      <div className="reset-password-container">
        <div className="reset-password-box shadow p-5 rounded">
          <h2 className="text-center mb-4">Reset Password</h2>
          <div className="mb-4">
            <div className="password-input-group input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                value={password}
                placeholder="Enter New Password*"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={togglePasswordVisibility}
              >
                <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
              </button>
            </div>
          </div>
          <div className="mb-4">
            <div className="password-input-group input-group">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-control"
                value={confirmPassword}
                placeholder="Confirm Password*"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={toggleConfirmPasswordVisibility}
              >
                <i className={`fas ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
              </button>
            </div>
          </div>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          {successMessage && <p className="text-success">{successMessage}</p>}
          <div className="d-grid gap-2">
            <button type="button" className="btn btn-primary btn-lg" onClick={handleUpdateClick}>
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
