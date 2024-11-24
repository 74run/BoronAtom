import React , {useState} from 'react';
import { Camera, Cog, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from './logo-no-background.png';

const AIResumeRoller = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prevState => !prevState);
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
   /* General Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
   background: linear-gradient(135deg, #a8c0ff, #3f5efb);
  line-height: 1.6;
  background-color: #f9f9f9;
  color: #333;
  padding: 0;
  margin: 0;
}

.container {
 background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent white background */
  border-radius: 10px; /* Optional rounded corners */
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}


/* Navbar Styles */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #7FB5B5; /* Soft teal background */
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Links (Desktop) */
.links {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  display: none; /* Hide links by default on mobile */
}

/* Show links when the mobile menu is open */
.links.open {
  display: flex;
}

.links a {
  text-decoration: none;
  color: #fff;
  font-weight: 600;
  margin: 0 15px;
}

/* Hamburger Icon */
.hamburger-menu {
  display: none; /* Hidden by default on larger screens */
  cursor: pointer;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 25px;
}

.hamburger-menu span {
  display: block;
  width: 100%;
  height: 4px;
  background-color: #fff;
  border-radius: 4px;
  transition: 0.3s ease;
}

/* Mobile Menu (Initially Hidden) */
.mobile-menu {
  display: none; /* Hide menu by default */
  position: absolute;
  top: 0;
  right: 0;
  background-color: #7FB5B5;
  width: 250px;
  height: 100vh;
  padding: 2rem;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
}

.mobile-menu.open {
  display: block;
  transform: translateX(0); /* Show menu when open */
}

.mobile-menu a {
  color: #fff;
  font-size: 1.2rem;
  text-decoration: none;
  margin-bottom: 20px;
  display: block;
}

/* Media Queries for Mobile View */
@media (max-width: 768px) {
  /* Hide links and show hamburger on mobile */
  .links {
    display: none;
  }

  .hamburger-menu {
    display: flex;
  }

  /* Mobile menu should be hidden by default, only shown when hamburger is clicked */
  .mobile-menu {
    display: none;
  }

  /* Mobile Menu open when clicked */
  .mobile-menu.open {
    display: block;
  }
}


.mobile-menu a,
.mobile-menu button {
  color: #fff;
  font-size: 1.2rem;
  text-decoration: none;
  margin-bottom: 20px;
  display: block;
}


/* Navbar links visibility on mobile */
.links {
  display: flex;
  align-items: center;
}

.links a {
  text-decoration: none;
  color: #fff;
  font-weight: 600;
  margin: 0 15px;
}

.auth-buttons {
  display: flex;
  align-items: center;
}

.auth-buttons button {
  margin-left: 10px;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

/* Media Queries for Mobile View */
@media (max-width: 768px) {
  .links {
    display: none;
  }

  .hamburger-menu {
    display: flex;
  }
}

/* Navigation */
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-radius: 8px;
}

nav .logo {
  display: flex;
  align-items: center;
}

nav .logo img {
  display: block;
  margin-right: 15px;
}

nav .links {
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: center;
}

nav .links a {
  margin: 0 15px;
  text-decoration: none;
  color: #fff;
  font-weight: 600;
  position: relative;
  transition: color 0.3s;
}

nav .links a:hover {
  color: #f0f8ff; /* Soft light blue on hover for calm contrast */
}
nav .links a.hover-underline-animation::after {
  content: '';
  display: block;
  width: 0;
  height: 2px;
   background: #f0f8ff;
  transition: width 0.3s;
  margin-top: 5px;
}

nav .links a.hover-underline-animation:hover::after {
  width: 100%;
}

nav .auth-buttons {
  display: flex;
  align-items: center;
}

nav .auth-buttons button {
  margin-left: 10px;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

nav .auth-buttons .login-nav-btn {
  background-color: #f0f8ff; /* Light blue button for calming effect */
  color: #007bff; /* Soft contrasting color for button text */
}

nav .auth-buttons .register-btn {
  background-color: #fff; /* Light white button for subtle contrast */
  color: #007bff; /* Soft contrasting color for button text */
}

nav .auth-buttons button:hover {
  background-color: #0056b3; /* Dark blue on hover for buttons */
  color: #fff;
}

/* Profile Section */
.profile-section {
 background: rgba(255, 255, 255, 0.85);
  text-align: center;
  margin-top: 3rem;
}

.profile-img-container {
  margin-bottom: 1rem;
}

.profile-img-container img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 3px solid #007bff;
}

.profile-section h1 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.profile-section h2 {
  font-size: 1.2rem;
  color: #555;
}

.profile-section .btn {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.profile-section .btn:hover {
  background-color: #0056b3;
}

/* Actions Section */
.actions-container {
  display: flex;
  justify-content: space-evenly;
  padding: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background-color: #fff;
  border: 2px solid #007bff;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;
  width: 250px;
}

.action-btn .icon {
  font-size: 2rem;
  color: #007bff;
  margin-bottom: 0.5rem;
}

.action-btn span {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.action-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

/* Cards Section */
.cards-section {
background: rgba(255, 255, 255, 0.8);
  margin-top: 3rem;
   padding: 3rem 0;
  border-radius: 10px;
}

.cards-grid {
  display: grid;
  gap: 1.5rem;
}

.cards-grid.grid {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.card {
   background-color: #f9f9f9;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card .p-6 {
  padding: 1.5rem;
}

.card h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.card p {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
}

.card .btn-modern {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
}

.card .btn-modern:hover {
  background-color: #0056b3;
}

      `}</style>

<div className="background-wrapper">
  {/* Background Image Applied via CSS */}
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


<nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo" className="d-inline-block align-top img-fluid" />
        </div>

        {/* Desktop Links */}
        <div className="links">
          <a href="#" className="hover-underline-animation">Contact</a>
          <a href="#" className="hover-underline-animation">Profile</a>
          <a href="#" className="hover-underline-animation">Promotions</a>
          <a href="#" className="hover-underline-animation">LaTex PDF</a>
        </div>

        {/* Authentication Buttons */}
        <div className="auth-buttons">
          <button className="login-nav-btn" onClick={handleLoginClick}>Login</button>
          <button className="register-btn" onClick={handleRegisterClick}>Register</button>
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="hamburger-menu" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <a href="#">Contact</a>
          <a href="#">Profile</a>
          <a href="#">Promotions</a>
          <a href="#">LaTex PDF</a>
          <button className="login-nav-btn" onClick={handleLoginClick}>Login</button>
          <button className="register-btn" onClick={handleRegisterClick}>Register</button>
        </div>
      </nav>


      <div className="container">
  

  <div className="profile-section">
    <div className="profile-img-container">
      <img
        src="https://storage.googleapis.com/a1aa/image/E53p7OQhLfXPE6ldt8QT2DEeQcilw3aJaOYiWE9a4gZeimmnA.jpg"
        alt="Profile picture placeholder"
        className="profile-img"
      />
    </div>
    <h1>Rachel Green</h1>
    <h2>Welcome to Boron Atom</h2>
    <div className="container">
    <button className="btn" onClick={handleLoginClick}>Login here</button>
    </div>
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

        
</div>

   {/* Cards Section */}
   <div className="cards-section mt-12 px-8">
  <div className="cards-grid grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {/* Card 1 */}
    <div className="card bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
      <img
        src="https://storage.googleapis.com/a1aa/image/U7thyR4IkUZuOZGe8V7MVqP34pGr3nAxKb38SF6ic1ebRTzTA.jpg"
        alt="Resume Template"
        className="w-full h-56 object-cover"
      />
      <div className="p-6">
        <h3 className="text-gray-900 text-xl font-semibold mb-2">Resume Template</h3>
        <p className="text-gray-700 mb-4">A professional resume template to help you land your dream job.</p>
        <button className="btn-modern">Download</button>
      </div>
    </div>

    {/* Card 2 */}
    <div className="card bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
      <img
        src="https://storage.googleapis.com/a1aa/image/JxcAFQMgd0puFFsUp4yRDY3aFeyC3TvtFshecFq0CUe1immnA.jpg"
        alt="Cover Letter Template"
        className="w-full h-56 object-cover"
      />
      <div className="p-6">
        <h3 className="text-gray-900 text-xl font-semibold mb-2">Cover Letter Template</h3>
        <p className="text-gray-700 mb-4">A clean and professional cover letter template to complement your resume.</p>
        <button className="btn-modern">Download</button>
      </div>
    </div>

    {/* Card 3 */}
    <div className="card bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
      <img
        src="https://storage.googleapis.com/a1aa/image/yYy6QfPwIARUM6SGpGe5KYfDN8aAERebYAmpUFmUXUo3FNNPB.jpg"
        alt="Work from Home"
        className="w-full h-56 object-cover"
      />
      <div className="p-6">
        <h3 className="text-gray-900 text-xl font-semibold mb-2">Work from Home</h3>
        <p className="text-gray-700 mb-4">Tips and tricks to stay productive while working from home.</p>
        <button className="btn-modern">Read More</button>
      </div>
    </div>
  </div>



    
      </div>


     

 
    </>
  );
};

export default AIResumeRoller;
