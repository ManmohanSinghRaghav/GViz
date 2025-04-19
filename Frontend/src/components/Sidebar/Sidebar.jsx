import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/" className="sidebar-button home-button">
        <FontAwesomeIcon icon="home" />
        <span>Home</span>
      </Link>
    </div>
  );
};

export default Sidebar;