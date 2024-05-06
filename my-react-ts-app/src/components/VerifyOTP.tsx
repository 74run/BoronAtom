import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const checkAndClearLocalStorage = () => {
    const storedData = localStorage.getItem('userId');
  
    if (storedData) {
      const { data, timestamp } = JSON.parse(storedData);
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - timestamp;
  
      // Set your desired time limit
      const timeLimit = 3 * 60 * 1000; // 3 min in milliseconds
  
      if (timeDifference > timeLimit) {
        // Clear localStorage after the specified time
        localStorage.removeItem('userId');
        return null; // If data is cleared, return null
      }
      const parsedObject = JSON.parse(storedData);
      const userId = parsedObject.userId;
      return userId; // If data is within the time limit, return the data
    }
  
    return null; // If no data is found, return null
  };
  
  

  const handleVerification = async () => {
    try {
      const userId = checkAndClearLocalStorage();

      console.log('userid from checkAndClearLocalStorage is: ', userId);
      const response = await axios.post(`${API_BASE_URL}/api/verifyOTP`, { userId, otp });
      const msg = response.data.message;

      if (msg === 'User email verified successfully.') {
        navigate('/login');
      } else {
        // Set the error message
        setErrorMessage(msg);
        setIsVerified(false); // Assuming you want to set isVerified state to false
      }

      console.log('Response is:', response.data);
    } catch (error: any) {
      // Explicitly specify the type of 'error' as 'any'
      console.error('Verification error:', error.message || 'Unknown error');
    }
  };
  return (
    <div className="verification-container">
      <h2>Enter Verification OTP</h2>
      <label htmlFor="otpInput">OTP:</label>
      <input
        type="text"
        id="otpInput"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="otp-input"
      />
      <button onClick={handleVerification} className="verify-button">Verify</button>
  
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {isVerified && <p className="success-message">Verification successful! You can proceed.</p>}
  
      <style >{`
        .verification-container {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #f9f9f9;
        }
  
        h2 {
          font-size: 24px;
          margin-bottom: 20px;
        }
  
        label {
          font-size: 16px;
          margin-bottom: 10px;
          display: block;
        }
  
        .otp-input {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
  
        .verify-button {
          padding: 10px 20px;
          font-size: 16px;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
  
        .verify-button:hover {
          background-color: #0056b3;
        }
  
        .error-message {
          color: red;
          margin-top: 10px;
        }
  
        .success-message {
          color: green;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
  
};

export default VerifyOTP;
