
import React, { useState } from 'react';
import '../../../styles/Navbar.css';
import logo from '../../../assets/logo.png.png';
import { FaBars, FaHome, FaCog, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="custom-navbar">
        <div className="menu-icon" onClick={toggleSidebar}>
          <FaBars />
        </div>
        <img src={logo} alt="Logo" className="navbar-logo" />
      </div>

      {isOpen && (
        <div className="sidebar">
          <ul>
            <li><FaHome /> Home</li>
            <li><FaCog /> Settings</li>
            <li><FaUser /> Profile</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;


