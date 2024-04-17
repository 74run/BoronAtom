import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Navbar.css'; // Import custom CSS for Navbar styling
import { Navbar as BootstrapNavbar, Nav as BootstrapNav, NavDropdown, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBell, faUserFriends, faSearch } from '@fortawesome/free-solid-svg-icons'; // Import necessary icons
import pic from './Gold.png';

interface NavbarProps {
  // Add any props you need
  onLogout: () => void;

}

const Navbar: React.FC<NavbarProps> = ({onLogout}) => {
  const [activeItem, setActiveItem] = useState<string>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
    // You can add additional logic here if needed
  };

  const handleLogout = () => {
    // Update isLoggedIn state after logout
    setIsLoggedIn(false);
    // You may also want to clear any stored tokens or user data from session storage
    sessionStorage.removeItem('Token');
    sessionStorage.removeItem('UserID');
  };
  

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white shadow">
      <div className="container-fluid">
        <BootstrapNavbar bg="dark" variant="dark" fixed="top" className="custom-navbar">
        <div className="input-group mx-auto" style={{ width: '400px' }}> {/* Centered with fixed width */}
  <input type="text" className="form-control" placeholder="Search" aria-label="Search" aria-describedby="button-addon2" />
  <div className="input-group-append">
    <button className="btn btn-outline-success" type="button" id="button-addon2">
      <FontAwesomeIcon icon={faSearch} />
    </button>
  </div>
</div>

          <BootstrapNav className="ms-auto"> {/* Added class for left alignment */}
            <Link
              to="/"
              className={`nav-link ${activeItem === 'home' ? 'active' : ''}`}
              onClick={() => handleItemClick('home')}
            >
              <FontAwesomeIcon icon={faHome} /> Home
            </Link>
            <Link
              to="/notifications"
              className={`nav-link ${activeItem === 'notifications' ? 'active' : ''}`}
              onClick={() => handleItemClick('notifications')}
            >
              <FontAwesomeIcon icon={faBell} /> Notifications
            </Link>
            <Link
              to="/add-friends"
              className={`nav-link ${activeItem === 'add-friends' ? 'active' : ''}`}
              onClick={() => handleItemClick('add-friends')}
            >
              <FontAwesomeIcon icon={faUserFriends} /> Add Friends
            </Link>
            <div style={{ display: 'flex' }}>
              
              <NavDropdown title={<Image src={pic} alt="Logo" roundedCircle className="profile-pic" />}>
                <NavDropdown.Item>
                  <Image src={pic} alt="Profile" roundedCircle className="profile-pic" />
                  Your Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>Notifications</NavDropdown.Item>
                <NavDropdown.Item>Add Friends</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>Settings</NavDropdown.Item>
                <NavDropdown.Item>Privacy</NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </div>
          </BootstrapNav>
        </BootstrapNavbar>
      </div>
    </nav>
  );
};

export default Navbar;

