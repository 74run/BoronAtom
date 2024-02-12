// Navbar.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Navbar.css'; // Import custom CSS for Navbar styling
import { Navbar as BootstrapNavbar, Nav as BootstrapNav, NavDropdown, Image } from 'react-bootstrap';
import pic from './Gold.png';

interface NavbarProps {
  // Add any props you need
}

const Navbar: React.FC<NavbarProps> = () => {
  const [activeItem, setActiveItem] = useState<string>('home');
  const navigate = useNavigate();

  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
    // You can add additional logic here if needed
  };

  const handleLogout = () => {
    // Perform the logout actions here
    // For example, clear user authentication token, redirect to login page, etc.
    console.log('Logout clicked');
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
  <BootstrapNavbar bg="dark" variant="dark" fixed="top" className="custom-navbar">
    <BootstrapNav className="" style={{}}>
      <Link
        to="/"
        className={`nav-link ${activeItem === 'home' ? 'active' : ''}`}
        onClick={() => handleItemClick('home')}
      >
        Home
      </Link>
      <Link
        to="/notifications"
        className={`nav-link ${activeItem === 'notifications' ? 'active' : ''}`}
        onClick={() => handleItemClick('notifications')}
      >
        Notifications
      </Link>
      <Link
        to="/add-friends"
        className={`nav-link ${activeItem === 'add-friends' ? 'active' : ''}`}
        onClick={() => handleItemClick('add-friends')}
      >
        Add Friends
      </Link>
      <NavDropdown title={<Image src={pic} alt="Logo" roundedCircle className="profile-pic" />} id="basic-nav-dropdown">
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
    </BootstrapNav>
  </BootstrapNavbar>
</div>

  );
};

export default Navbar;
