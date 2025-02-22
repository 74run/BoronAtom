import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faChevronDown, 
  faCog, 
  faEnvelopeOpen, 
  faFileAlt, 
  faShield, 
  faSignOutAlt, 
  faTimes,
  faUser,
  faBriefcase
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import logo from './images/logo-no-background.png';
import { useUserId } from './useUserId';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

interface NavbarProps {
  UserDetail: UserDetails | null;
}

const Navbar: React.FC<NavbarProps> = () => {
  const [profileImage, setProfileImage] = useState<string>('');
  const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth < 768);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userID = useUserId();
  
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  console.log(" Navbar USER ID: ", userID);
 

  // Handle click outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && 
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  

  // Handle mobile menu body scroll
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch profile image
  useEffect(() => {
    const userID = localStorage.getItem('UserID');
    if (userID) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/image`, { 
          responseType: 'arraybuffer' 
        })
        .then((response) => {
          const base64Image = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte), 
              ''
            )
          );
          const contentType = response.headers['content-type'];
          setProfileImage(`data:${contentType};base64,${base64Image}`);
        })
        .catch((error) => {
          console.error('Error fetching profile image:', error);
        });
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
   
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };


  const DesktopNav = () => (
    <>
      <Link 
        to={`/profile/${userID}`} 
        className={`nav-link ${location.pathname === `/profile/${userID}` ? 'active' : ''}`}
      >
        <FontAwesomeIcon icon={faFileAlt} className="icon" />
        AI Resume
      </Link>
      
      <Link 
        to={`/ai-cover-letter/${userID}`} 
        className={`nav-link ${location.pathname === `/ai-cover-letter/${userID}` ? 'active' : ''}`}
      >
        <FontAwesomeIcon icon={faEnvelopeOpen} className="icon" />
        AI Cover Letter
      </Link>

      <Link 
        to={`/ai-portfolio/${userID}`} 
        className={`nav-link ${location.pathname === `/ai-portfolio/${userID}` ? 'active' : ''}`}
      >
        <FontAwesomeIcon icon={faBriefcase} className="icon" />
        AI Portfolio
      </Link>

      <div className="profile-section">
        <div className="profile-dropdown" ref={dropdownRef}>
          <button 
            ref={buttonRef}
            className="profile-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img 
              src={profileImage || `https://avatar.iran.liara.run/public/boy?username=${userDetails?.username}`}
              alt="Profile"
              className="profile-pic"
            />
            <FontAwesomeIcon 
              icon={faChevronDown} 
              className="icon"
              style={{ 
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.2s ease'
              }}
            />
          </button>

          <div className={`dropdown-menu ${dropdownOpen ? 'active' : ''}`}>
            <Link 
              to={`/profile/${userID}`} 
              className="dropdown-item"
              onClick={() => setDropdownOpen(false)}
            >
              <FontAwesomeIcon icon={faUser} className="icon" />
              <span>Your Profile</span>
            </Link>
            
            <div className="dropdown-divider" />
            
            <Link 
              to="/settings" 
              className="dropdown-item"
              onClick={() => setDropdownOpen(false)}
            >
              <FontAwesomeIcon icon={faCog} className="icon" />
              <span>Settings</span>
            </Link>
            
            <Link 
              to="/privacy" 
              className="dropdown-item"
              onClick={() => setDropdownOpen(false)}
            >
              <FontAwesomeIcon icon={faShield} className="icon" />
              <span>Privacy</span>
            </Link>
            
            <div className="dropdown-divider" />
            
            <button 
              onClick={() => {
                setDropdownOpen(false);
                handleLogout();
              }} 
              className="dropdown-item"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Mobile Navigation Links
  const MobileNav = () => (
    <>
      <div className="mobile-menu-header">
        <img src={logo} alt="Brand Logo" style={{ height: '24px' }} />
        <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <Link 
        to={`/profile/${userID}`} 
        className="mobile-nav-item"
        onClick={() => setMobileMenuOpen(false)}
      >
        <FontAwesomeIcon icon={faFileAlt} />
        <span>AI Resume</span>
      </Link>
      
      <Link 
        to={`/ai-cover-letter/${userID}`} 
        className="mobile-nav-item"
        onClick={() => setMobileMenuOpen(false)}
      >
        <FontAwesomeIcon icon={faEnvelopeOpen} />
        <span>AI Cover Letter</span>
      </Link>

      <Link 
        to={`/ai-portfolio/${userID}`} 
        className="mobile-nav-item"
        onClick={() => setMobileMenuOpen(false)}
      >
        <FontAwesomeIcon icon={faBriefcase} />
        <span>AI Portfolio</span>
      </Link>

      <Link 
        to="/settings" 
        className="mobile-nav-item"
        onClick={() => setMobileMenuOpen(false)}
      >
        <FontAwesomeIcon icon={faCog} />
        <span>Settings</span>
      </Link>

      <Link 
        to="/privacy" 
        className="mobile-nav-item"
        onClick={() => setMobileMenuOpen(false)}
      >
        <FontAwesomeIcon icon={faShield} />
        <span>Privacy</span>
      </Link>

      <div className="mobile-profile-section">
        <Link 
          to={`/profile/${userID}`}
          className="mobile-nav-item"
          onClick={() => setMobileMenuOpen(false)}
        >
          <img 
            src={profileImage || `https://avatar.iran.liara.run/public/boy?username=${userDetails?.username}`}
            alt="Profile"
            className="profile-pic"
            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
          />
          <span>Your Profile</span>
        </Link>

        <button 
          className="mobile-nav-item"
          onClick={() => {
            handleLogout();
            setMobileMenuOpen(false);
          }}
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );




  return (
    <nav className="main-navbar">
      <style>
        {`
          .main-navbar {
            background-color: #1b1b2f;
            border-bottom: 1px solid #333;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            padding: 0.75rem 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
  
          .navbar-container {
            max-width: 1800px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
  
          .logo-container {
            display: flex;
            align-items: center;
            size: 0.32rem;
          }
  
          .logo-image {
            height: 1.5rem;
            width: auto;
            transition: transform 0.2s ease;
          }
  
          .logo-container:hover .logo-image {
            transform: scale(1.05);
          }
  
          .nav-links {
            display: flex;
            align-items: center;
            gap: 1rem;
          }
  
          .nav-link {
            color: #a0aec0;
            text-decoration: none;
            padding: 0.75rem 1.25rem;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 500;
            transition: all 0.2s ease;
            position: relative;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            line-height: 1;
          }
  
            .nav-link:hover {
            color: #63b3ed;
            background-color: rgba(99, 179, 237, 0.1);
            border-color: rgba(99, 179, 237, 0.3);
            transform: translateY(-1px);
          }

          .nav-link.active {
            color: #63b3ed;
            background-color: rgba(99, 179, 237, 0.15);
            border-color: rgba(99, 179, 237, 0.4);
            box-shadow: 0 2px 8px rgba(99, 179, 237, 0.1);
          }

          .nav-link .icon {
            font-size: 0.8rem;
            transition: transform 0.2s ease;
            display: flex;
            align-items: center;
          }

          .nav-link:hover .icon {
            transform: scale(1.1);
          }

  
      
  
          .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 50%;
            transform: translateX(-50%);
            width: 20px;
            height: 2px;
            background-color: #63b3ed;
            border-radius: 2px;
          }
  
          .profile-section {
            display: flex;
            align-items: center;
            gap: 1.5rem;
          }
  
    
  
          .profile-button {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.5rem;
            border: none;
            background: none;
            cursor: pointer;
            color: #a0aec0;
            transition: all 0.2s ease;
          }
  
          .profile-button:hover {
            color: #63b3ed;
          }
  
          .profile-pic {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 2px solid #333;
            transition: border-color 0.2s ease;
          }
  
          .profile-button:hover .profile-pic {
            border-color: #63b3ed;
          }
  
        .dropdown-menu {
            position: absolute;
            top: calc(100% + 0.5rem);
            right: 0;
            background-color: #1b1b2f;
            border: 1px solid #333;
            border-radius: 12px;
            padding: 0.5rem;
            min-width: 220px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            display: none; /* Change this from visibility: hidden */
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            z-index: 9999; /* Increased z-index */
          }

          .dropdown-menu.active {
            display: block; /* Change this from visibility: visible */
            opacity: 1;
            transform: translateY(0);
          }

          .profile-dropdown {
            position: relative;
            z-index: 1001; /* Ensure dropdown container is above other elements */
          }

          /* Ensure the button stays above the dropdown */
          .profile-button {
            position: relative;
            z-index: 1002;
          }

          
         .dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #a0aec0;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  gap: 1rem;
  line-height: 1;
}

.dropdown-item .icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.dropdown-item:hover {
  background-color: rgba(99, 179, 237, 0.1);
  color: #63b3ed;
}

.dropdown-item span {
  font-size: 0.85rem; /* Optional: adjust text size if needed */
}

@media (max-width: 768px) {
  .dropdown-item {
    gap: 0.75rem; /* Slightly less spacing on mobile */
  }
}
  
          .dropdown-divider {
            height: 1px;
            background-color: #333;
            margin: 0.5rem 0;
          }
  
            .mobile-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 998;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .mobile-overlay.active {
            display: block;
            opacity: 1;
          }

          .mobile-menu-button {
            display: none;
            padding: 0.75rem;
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: #a0aec0;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 999;
          }

          .mobile-menu-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            padding: 0.75rem;
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: #a0aec0;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 1000;
          }

          @media (max-width: 768px) {
            .mobile-menu-button {
              display: flex;
              align-items: center;
              gap: 0.5rem;
            }

            .nav-links {
              position: fixed;
              top: 0;
              left: -300px;
              bottom: 0;
              width: 300px;
              background-color: #1b1b2f;
              padding: 2rem 1rem;
              flex-direction: column;
              gap: 1rem;
              transition: left 0.3s ease;
              z-index: 999;
              overflow-y: auto;
              display: flex !important;
              box-shadow: 4px 0 12px rgba(0, 0, 0, 0.2);
            }

            .nav-links.active {
              left: 0;
            }

            .mobile-menu-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 2rem;
              padding-bottom: 1rem;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .mobile-profile-section {
              margin-top: auto;
              padding-top: 1rem;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .mobile-profile-button {
              display: flex;
              align-items: center;
              gap: 1rem;
              width: 100%;
              padding: 1rem;
              background-color: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 8px;
              color: #a0aec0;
              cursor: pointer;
              transition: all 0.2s ease;
            }

            .mobile-profile-button:hover {
              background-color: rgba(99, 179, 237, 0.1);
              border-color: rgba(99, 179, 237, 0.3);
              color: #63b3ed;
            }

            .mobile-nav-item {
              width: 100%;
              padding: 1rem;
              display: flex;
              align-items: center;
              gap: 1rem;
              color: #a0aec0;
              text-decoration: none;
              border-radius: 8px;
              transition: all 0.2s ease;
              background-color: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.1);
              line-height: 1;
            }

            .mobile-nav-item svg {
              display: flex;
              align-items: center;
              width: 1rem;
              height: 1rem;
            }

            .mobile-nav-item:hover {
              background-color: rgba(99, 179, 237, 0.1);
              border-color: rgba(99, 179, 237, 0.3);
              color: #63b3ed;
            }

            .mobile-nav-item.active {
              background-color: rgba(99, 179, 237, 0.15);
              border-color: rgba(99, 179, 237, 0.4);
              color: #63b3ed;
            }


            .nav-link::after,
          .profile-button::after,
          .dropdown-item::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
              45deg,
              transparent,
              rgba(255, 255, 255, 0.03),
              transparent
            );
            transform: rotate(45deg);
            transition: all 0.3s ease;
            opacity: 0;
          }

          .nav-link:hover::after,
          .profile-button:hover::after,
          .dropdown-item:hover::after {
            opacity: 1;
          }
          }

          @media (max-width: 768px) {
            .profile-section {
              display: none; /* Hide desktop profile section on mobile */
            }
            
            .nav-links > .nav-link {
              display: none; /* Hide desktop nav links on mobile */
            }
          }

          @media (min-width: 769px) {
            .mobile-menu-header,
            .mobile-profile-section,
            .mobile-nav-item {
              display: none; /* Hide mobile elements on desktop */
            }
          }
        `}
      </style>
  
      <div 
        className={`mobile-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div className="navbar-container">
        <Link to="/" className="logo-container">
          <img src={logo} alt="Brand Logo" className="logo-image" />
        </Link>

        <button className="mobile-menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <FontAwesomeIcon icon={faBars} size="lg" />
          
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          {isMobileView ? <MobileNav /> : <DesktopNav />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
