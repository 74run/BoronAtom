import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import '../css/ForgotPassword.css'; // Import custom CSS

import back from './unnamed-1.png'

import logo from './logo-no-background.png'; // Your logo file

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isResetLinkSent, setIsResetLinkSent] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };


  const handleSendClick = async () => {
    setLoading(true); // Start loading animation
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/forgotpassword`, { email });
      const msg = response.data.message;
      localStorage.setItem('Email', email);
  
      if (msg === 'Reset Password email sent') {
        setIsResetLinkSent(true);
        setErrorMessage('');
      } else {
        setErrorMessage(msg);
        setIsResetLinkSent(false);
      }
    } catch (error: any) {
      console.error('Verification error:', error.message || 'Unknown error');
      setErrorMessage('An error occurred. Please try again.');
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


   

     

      {/* <BootstrapNavbar bg="dark" variant="dark" fixed="top" className="custom-navbar">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Logo" style={{
                  height: "25px",
                  width: "auto",
                }} />
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
      }}>Forgot your Password?</h2>
          <p className="text-center mb-4">Please Enter your Registered Email address.</p>
          <div className="mb-4">
            <input
              type="email"
              className="form-control"
              placeholder="Email Address*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically if needed
    height: '100%', // Optional: Ensures it takes the full height of the container
  }}
>
  {isResetLinkSent && <p className="text-success mt-3">Reset Password Link has been sent!</p>}
  {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
</div>

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
  onClick={handleSendClick}
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
      <span style={{ marginLeft: '0.5rem' }}>Sending...</span>
    </div>
  ) : (
    'Send'
  )}
</button>

          </div>
          <div className="text-center mt-4">
          <p className="mt-6 text-center text-sm">Don't have an account? <a onClick={handleRegisterClick} style={{ cursor: 'pointer' }} className="text-blue-500 hover:underline">Sign up</a></p>
          </div>

          <div className="text-center mt-4">
          <p className="mt-6 text-center text-sm">Already have an account? <a onClick={handleLoginClick} style={{ cursor: 'pointer' }} className="text-blue-500 hover:underline">Sign in</a></p>
          </div>
        </div>
      </div>

      <style>{`
        .forgot-password-page {
          background-color: #1c1c1e;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #f5f5f5;
          font-family: 'Roboto', sans-serif;
          padding-top: 80px;
        }

        .forgot-password-container {
          max-width: 500px;
          width: 100%;
          margin: auto;
          padding: 20px;
        }

        .forgot-password-box {
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
        }

        .btn-outline-primary:hover {
          background-color: #4CAF50;
          color: white;
        }

        .text-success {
          color: #4CAF50 !important;
        }

        .text-danger {
          color: #dc3545 !important;
        }
      `}</style>
    </div>

    </>
  );
};

export default ForgotPassword;
