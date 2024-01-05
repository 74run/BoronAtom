import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isResetLinkSent, setIsResetLinkSent] = useState(false);
  const navigate = useNavigate();

  const handleSendClick = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/forgotpassword', { email });
      const msg = response.data.message;
      console.log("status of resp:", msg);
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
  }

  return (
    <div className="login-container">
      <h2>Forgot your Password?</h2>
      <p>Enter your email address to receive a password reset link.</p>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Email Address*"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {isResetLinkSent && <p style={{ color: 'green' }}>Reset Password Link has been sent!</p>}
      </div>
      <button type="button" className="btn btn-primary" onClick={handleSendClick}>
        Send
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </button>
    </div>
  );
};

export default ForgotPassword;
