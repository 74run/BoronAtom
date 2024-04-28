import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ResetPassword: React.FC = () => {
  const [lemail, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
 
  useEffect(() => {
    // Fetch email from the forgot password API endpoint
    const fetchEmail = async () => {
      try {
        const response = await axios.post( `${process.env.REACT_APP_API_URL}/api/forgotpassword`);
        setEmail(response.data.data);
         // Set the email state with the email from the response
      } catch (error: any) {
        console.error('Error fetching email:', error.message || 'Unknown error');
      }
    };

    fetchEmail();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleUpdateClick = async () => {
    const email = localStorage.getItem('Email')
    console.log('Email:', email);
    try {
      // Check if passwords match
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        return;
      }


      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/resetpassword`, { email, password });
      const msg = response.data.message;
      console.log("status of resp:", msg);
      if (msg === 'Password reset successfully') {
        navigate('/login');
        localStorage.removeItem('Email')
      } else {
        setErrorMessage(msg);
      }
    } catch (error: any) {
      console.error('Password reset error:', error.message || 'Unknown error');
    }
  }

  return (
    <div className="login-container">
      <h2>Reset Password</h2>
      <div className="mb-3">
        <div className="password-input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            className="form-control"
            value={password}
            placeholder='Enter New Password*'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="btn eye-icon-btn"
            onClick={togglePasswordVisibility}
          >
            <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
          </button>
        </div>
      </div>
      <div className="mb-3">
        <div className="password-input-group">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            className="form-control"
            value={confirmPassword}
            placeholder='Confirm Password*'
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="btn eye-icon-btn"
            onClick={toggleConfirmPasswordVisibility}
          >
            <i className={`fas ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
          </button>
        </div>
      </div>
      <button type="button" className="btn btn-primary" onClick={handleUpdateClick}>
        Update
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </button>
    </div>
  );
};

export default ResetPassword;
