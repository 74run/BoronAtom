import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate , Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../css/ResetPassword.css';

import back from '../images/unnamed-1.png'

import logo from '../images/logo-no-background.png'; // Your logo file

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegisterClick = () => {
    navigate('/register');
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
  
    setLoading(true); // Start loading animation
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/resetpassword`, { token, password });
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
    } finally {
      setLoading(false); // Stop loading animation
    }
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


{/*    
     
      <BootstrapNavbar bg="dark" variant="dark" fixed="top" className="custom-navbar">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Logo" style={{ height: '25px', width: 'auto' }} />
          </a>
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

      {/* Reset Password Form */}
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
      }}>
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
           onClick={handleUpdateClick}
           disabled={loading}
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
      <span style={{ marginLeft: '0.5rem' }}>Updating...</span>
    </div>
  ) : (
    'Update Password'
  )}
          </button>
        </div>
      </div>
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

    </>
  );
};

export default ResetPassword;
