import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link  } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import '../../css/VerifyOTP.css'; // Import your custom CSS file
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

import logo from '../images/logo-no-background.png';

import back from '../images/unnamed-1.png';


const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
  
    setLoading(true); // Start loading animation
    try {
      const response = await axios.post(`${API_BASE_URL}/verifyOTP`, {
        otp,
        userId, // Pass userId from local storage
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
    } finally {
      setLoading(false); // Stop loading animation
    }
  };
  

  const handleResendOTP = async () => {
    if (!userId) {
      setErrorMessage('User ID is missing. Please try again.');
      return;
    }

    setIsResending(true); // Indicate that the OTP is being resent

    try {
      const response = await axios.post(`${API_BASE_URL}/resendOTP`, { userId });
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
    <>

    <style>{`
    body {
            margin: 0;
            font-family: 'Roboto', sans-serif;
            background: url(${back}) no-repeat center center fixed;
            background-size: cover;
        }
    .navbar-1 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 50px;
        }
        .navbar-1 .logo {
            display: flex;
            align-items: center;
        }
        .navbar-1 .logo img {
            width: 40px;
            margin-right: 10px;
        }
        .navbar-1 .logo span {
            color: white;
            font-size: 24px;
            font-weight: 700;
        }
        .navbar-1 ul {
            list-style: none;
            display: flex;
            margin: 0;
            padding: 0;
        }
        .navbar-1 ul li {
            margin: 0 15px;
        }
        .navbar-1 ul li a {
            color: white;
            text-decoration: none;
            font-size: 18px;
        }
        .navbar-1 .login-btn {
            background: white;
            color: black;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 500;
            transition: background 0.3s ease, color 0.3s ease;
        }
        .navbar-1 .login-btn:hover {
            background: #00bcd4;
            color: white;
        }
        `}</style>

    <head>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet"></link>

    </head>
    <div className="login-page" style={{ minHeight: "100vh", color: "#f5f5f5", fontFamily: "'Roboto', sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div className="background-wrapper">
        <div className="background-gradient"></div>
        <div className="particles-layer-1"></div>
        <div className="particles-layer-2"></div>
        <div className="particles-layer-3"></div>
      </div>

 
      {/* <BootstrapNavbar bg="dark" variant="dark" fixed="top" className="custom-navbar">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Logo"style={{
                  height: "25px",
                  width: "auto",
                }} />
          </a>
          <Nav className="ms-auto">
            <Nav.Link onClick={handleLoginClick}>Login</Nav.Link>
            <Nav.Link onClick={handleRegisterClick}>Register</Nav.Link>
          </Nav>
        </div>
      </BootstrapNavbar> */}

      <div className="navbar-1">
   <div className="logo">
   <Link to="/">
   <img 
                src={logo}
                alt="Logo"
                className="img-fluid"
                style={{ height: "25px", width: "auto" }}
              />  
              </Link> </div>
  
   <a className="login-btn" onClick={handleRegisterClick}  style={{ cursor: 'pointer' }}>
    Sign Up
   </a>
  </div>

  <div className="flex items-center justify-center min-h-screen" style={{ paddingTop: "80px", backgroundPosition: "center", display:'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          className="bg-gray-800 bg-opacity-75 p-8 rounded-lg shadow-lg w-full max-w-md"
          style={{
            backgroundColor: 'rgba(31, 41, 55, 0.75)', // bg-gray-800 with bg-opacity-75
            padding: '2rem', // p-8
            borderRadius: '0.5rem', // rounded-lg
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)', // shadow-lg
            width: '100%', // w-full
            maxWidth: '28rem', // max-w-md
          }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center"
      style={{
        fontSize: '1.875rem', // text-3xl (which is 3rem, 48px in Tailwind, converted to rem)
        fontWeight: '700', // font-bold
        marginBottom: '1.5rem', // mb-6 (which is 6 * 0.25rem = 1.5rem)
        textAlign: 'center', // text-center
        color: 'white'
      }}>Verify Your Account</h2>
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
                width: '100%', // w-full
                padding: '0.75rem', // p-3 (equivalent to 3 * 0.25rem = 0.75rem)
                borderRadius: '0.5rem',
                color: '#ffffff',  // rounded-lg
                backgroundColor: '#2d3748', // bg-gray-700
                border: '1px solid #4a5568', // border-gray-600
                outline: 'none', // focus:outline-none
                transition: 'all 0.3s', // Smooth transition for focus effect
              }}
            />
          </div>
          <div className="d-grid gap-2">
  
           <button
  type="submit"
  style={{
    width: '100%', // w-full
    padding: '0.75rem', // p-3
    color: 'white',
    backgroundColor: loading ? '#1e40af' : '#2563eb', // Change color during loading
    borderRadius: '0.5rem', // rounded-lg
    fontWeight: '600', // font-semibold
    transition: 'all 0.3s', // Smooth transition for hover and focus effects
    cursor: loading ? 'not-allowed' : 'pointer', // Prevent multiple clicks
  }}
  className={`focus:outline-none focus:ring-2 ${
    loading ? 'focus:ring-blue-400' : 'focus:ring-blue-500'
  } hover:bg-blue-700`}
  onClick={handleVerification}
  disabled={loading} // Disable button during loading
>
  {loading ? (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          border: '3px solid white',
          borderTop: '3px solid #2563eb',
          borderRadius: '50%',
          width: '1rem',
          height: '1rem',
          animation: 'spin 1s linear infinite',
        }}
      ></div>
      <span style={{ marginLeft: '0.5rem' }}>Verifying...</span>
    </div>
  ) : (
    'Verify'
  )}
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
        .background-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -1;
        }
        .background-gradient {
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, rgba(158,92,236,0.2) 0%, rgba(30,82,153,0.2) 45%, rgba(29,39,54,0.2) 100%);
          animation: rotateGradient 30s linear infinite;
          transform-origin: center;
        }
        .particles-layer-1,
        .particles-layer-2,
        .particles-layer-3 {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: 60px 60px;
          opacity: 0.3;
        }
        .particles-layer-1 {
          background: radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px);
          animation: animateParticles 25s linear infinite;
        }
        .particles-layer-2 {
          background: radial-gradient(circle, rgba(158,92,236,0.1) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: animateParticles 20s linear infinite reverse;
        }
        .particles-layer-3 {
          background: radial-gradient(circle, rgba(30,82,153,0.1) 1px, transparent 1px);
          background-size: 80px 80px;
          animation: animateParticles 30s linear infinite;
        }
        @keyframes rotateGradient {
          0% { transform: rotate(0deg) scale(1.5); }
          100% { transform: rotate(360deg) scale(1.5); }
        }
        @keyframes animateParticles {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-100%, -100%); }
        }
      `}</style>
    </div>
    </>
  );
};

export default VerifyOTP;
