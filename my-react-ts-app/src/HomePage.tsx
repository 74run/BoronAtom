import React from 'react';
import { Camera, Cog, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from './logo-no-background.png';

const AIResumeRoller = () => {
  const navigate = useNavigate();

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
          padding: 0;
          font-family: 'Roboto', sans-serif;
          background: linear-gradient(
            135deg,
            rgba(29,39,54,1) 0%,
            rgba(30,82,153,1) 35%,
            rgba(158,92,236,1) 100%
          );
          color: white;
          min-height: 100vh;
          background-attachment: fixed;
          overflow-x: hidden;
        }

        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          padding: 0 20px;
          position: relative;
          z-index: 1;
          padding-top: 6rem; /* Gap between navbar and content */
        }

        /* Navbar Enhancements */
        nav {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          position: fixed;
          top: 0;
          z-index: 10;
          background: rgba(29, 39, 54, 0.6);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s ease;
        }

        nav .logo {
          display: flex;
          align-items: center;
        }

        nav .logo img {
          width: 50px;
          height: 50px;
          margin-right: 0.5rem;
        }

        nav .brand {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          text-decoration: none;
        }

        nav .links {
          display: flex;
          gap: 2rem;
        }

        nav .links a {
          color: white;
          text-decoration: none;
          font-size: 1rem;
          transition: color 0.3s;
        }

        nav .links a:hover {
          color: #22c55e;
        }

        nav .auth-buttons {
          display: flex;
          gap: 1rem;
        }

        .login-nav-btn, .register-btn {
          border: 1px solid white;
          background: transparent;
          color: white;
          padding: 0.5rem 1.5rem;
          font-size: 1rem;
          border-radius: 4px;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }

        .login-nav-btn:hover, .register-btn:hover {
          background-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        /* For Mobile Screens */
        @media (max-width: 768px) {
          nav .links {
            display: none;
          }

          nav .auth-buttons {
            flex-direction: column;
            gap: 0.5rem;
          }
        }

        .background-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }

        .background-gradient {
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle at center,
            rgba(158,92,236,0.2) 0%,
            rgba(30,82,153,0.2) 45%,
            rgba(29,39,54,0.2) 100%
          );
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

        .wave-layer {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 300px;
          background: rgba(255, 255, 255, 0.1);
          opacity: 0.2;
          border-radius: 50%;
          animation: moveWave 20s linear infinite;
        }

        .wave-layer:nth-child(2) {
          animation-duration: 25s;
          opacity: 0.1;
        }

        .wave-layer:nth-child(3) {
          animation-duration: 30s;
          opacity: 0.05;
        }

        @keyframes moveWave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .pulse-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          animation: pulseAnimation 10s infinite;
        }

        .pulse-circle:nth-child(2) {
          width: 300px;
          height: 300px;
          animation-duration: 12s;
        }

        .pulse-circle:nth-child(3) {
          width: 400px;
          height: 400px;
          animation-duration: 15s;
        }

        @keyframes pulseAnimation {
          0% { transform: scale(0.8); opacity: 0.3; }
          50% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(0.8); opacity: 0.3; }
        }

        .floating-shapes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .floating-shape {
          position: absolute;
          width: 20px;
          height: 20px;
          background: rgba(255, 255, 255, 0.15);
          animation: floatShapes 15s linear infinite;
        }

        .floating-shape:nth-child(odd) {
          background: rgba(158, 92, 236, 0.15);
        }

        .floating-shape:nth-child(2n) {
          animation-duration: 20s;
        }

        .floating-shape:nth-child(3n) {
          animation-duration: 25s;
        }

        @keyframes floatShapes {
          0% { transform: translateY(0); }
          100% { transform: translateY(-200vh); }
        }

         .card {
          position: relative;
          overflow: hidden;
        }

        .card::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.05) 50%,
            rgba(255,255,255,0) 100%
          );
          transform: rotate(45deg);
          animation: shimmer 6s linear infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }

        .profile-section {
          text-align: center;
          margin-top: 3rem;
          margin-bottom: 2rem;
        }

        .profile-img-container {
          width: 6rem;
          height: 6rem;
          background-color: #e5e7eb;
          border-radius: 9999px;
          margin: 0 auto 1rem auto;
          overflow: hidden;
        }

        .profile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 9999px;
        }

        h1 {
          font-size: 1.5rem;
          margin: 0;
        }

        h2 {
          font-size: 2.25rem;
          font-weight: bold;
          margin: 0.5rem 0;
        }

        .login-btn {
          background-color: #22c55e;
          color: white;
          padding: 0.5rem 2rem;
          margin-top: 1.5rem;
          font-size: 1.1rem;
        }

        .actions-container {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin: 3rem 0;
          flex-wrap: wrap;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #1e3a8a;
          color: white;
          padding: 0.75rem 1.5rem;
          transition: background-color 0.3s;
        }

        .action-btn:hover {
          background-color: #2d4ba0;
        }

        .icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .cards-container {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin: 2rem 0 4rem 0;
          flex-wrap: wrap;
        }

        .card {
          background-color: #1e3a8a;
          padding: 2rem;
          border-radius: 0.5rem;
          text-align: center;
          width: 250px;
          transition: transform 0.3s;
        }

        .card:hover {
          transform: translateY(-5px);
        }

        .card img {
          width: 100px;
          height: 100px;
          margin: 0 auto 1.5rem auto;
          border-radius: 0.5rem;
        }

        .card h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0;
        }

        .card p {
          margin-top: 0.75rem;
          margin-bottom: 0;
          color: #e5e7eb;
        }

        @media (max-width: 768px) {
          .cards-container {
            flex-direction: column;
            align-items: center;
          }

          .actions-container {
            flex-direction: column;
            align-items: center;
          }

          nav .links {
            gap: 1rem;
          }
        }
      `}</style>

      <div className="background-wrapper">
        <div className="background-gradient"></div>
        <div className="particles-layer-1"></div>
        <div className="particles-layer-2"></div>
        <div className="particles-layer-3"></div>
        <div className="wave-layer"></div>
        <div className="wave-layer"></div>
        <div className="wave-layer"></div>
        <div className="pulse-circle"></div>
        <div className="pulse-circle"></div>
        <div className="pulse-circle"></div>
        <div className="floating-shapes">
          <div className="floating-shape" style={{ left: '10%', top: '20%' }}></div>
          <div className="floating-shape" style={{ left: '50%', top: '40%' }}></div>
          <div className="floating-shape" style={{ left: '30%', top: '60%' }}></div>
          <div className="floating-shape" style={{ left: '80%', top: '10%' }}></div>
        </div>
      </div>

      <div className="container">
        <nav>
          <div className="logo">
          <img 
  src={logo} 
  alt="Logo" 
  className="d-inline-block align-top img-fluid"
  style={{ width: '170px', height: 'auto', marginRight: '15px' }} 
/>
{/* Your logo here */}
            <a href="#" className="brand"></a>
          </div>
          <div className="links">
            <a href="#">Contact</a>
            <a href="#">Profile</a>
            <a href="#">Promotions</a>
            <a href="#">LaTex PDF</a>
          </div>
          <div className="auth-buttons">
            <button className="login-nav-btn" onClick={handleLoginClick}>
              Login
            </button>
            <button className="register-btn" onClick={handleRegisterClick}>
              Register
            </button>
          </div>
        </nav>

        <div className="profile-section">
          <div className="profile-img-container">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Profile picture placeholder"
              className="profile-img"
            />
          </div>
          <h1>Rachel Green</h1>
          <h2>Welcome to Boron Atom</h2>
          <button className="login-btn">Login here</button>
        </div>

        <div className="actions-container">
          <button className="action-btn">
            <Camera className="icon" />
            <span>How to Register?</span>
          </button>
          <button className="action-btn">
            <Cog className="icon" />
            <span>How to use AI to write Resume?</span>
          </button>
          <button className="action-btn">
            <GraduationCap className="icon" />
            <span>Job Search</span>
          </button>
        </div>

        <div className="cards-container">
          <div className="card">
            <img
              src="https://storage.googleapis.com/a1aa/image/NzqambeUsAzxXCltiAl9K5SLQLN4yjFIUdMawshOiH4hKw0JA.jpg"
              alt="Repure logo placeholder"
            />
            <h3>Our Resume Template</h3>
            <p>Overleaf Resume Template</p>
          </div>
          <div className="card">
            <img
              src="https://storage.googleapis.com/a1aa/image/Ex0ULcw82wKeHaw0yyshN3bUh6QKxhXIQIfawQjqhAIAVgpTA.jpg"
              alt="AI Thounels logo placeholder"
            />
            <h3>Our Cover Letter</h3>
            <p>Standard Cover Letter Format</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIResumeRoller;
