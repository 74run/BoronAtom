import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS
const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to toggle confirmPassword visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleUpdateClick = async () => {
    try {
        const response = await axios.post('http://localhost:3001/api/forgotpassword', { password });
        const msg = response.data.message;
        console.log("status of resp:", msg);
        if (msg === 'Reset Password email sent') {
            navigate('/resetpassword');
          } else {
            // Set the error message
            setErrorMessage(msg);
            // setIsVerified(false); // Assuming you want to set isVerified state to false
          }
    } catch (error: any) {
        console.error('Verification error:', error.message || 'Unknown error');
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