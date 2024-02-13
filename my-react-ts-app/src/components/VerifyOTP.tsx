import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

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
      const response = await axios.post('http://localhost:3001/api/verifyOTP', { userId, otp });
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
    <div>
      <h2>Enter Verification OTP</h2>
      <label htmlFor="otpInput">OTP:</label>
      <input
        type="text"
        id="otpInput"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerification}>Verify</button>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {isVerified && <p>Verification successful! You can proceed.</p>}
    </div>
  );
};

export default VerifyOTP;