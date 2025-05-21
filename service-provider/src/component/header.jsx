import React from 'react';
import Logo from "./logo.jsx";
import Sidebar from './sidebar.jsx';
import "./header.css";
import NotificationButton from './NotificationButton.jsx';
import useAuth from '../hooks/useAuth.js';

const Header = () => {
  const { user } = useAuth();

  return (
    <div className="headers-container">
      <h5 className='namek'>{user?.role || 'Guest'}   Speciality: {user?.speciality || 'None'}
      </h5>
      <Logo />
      <Sidebar />
      <div style={{ position: "absolute", top: "20px", right: "110px" }}>
        <NotificationButton />
      </div>
      <div className='separation'></div>
    </div>
  );
};

export default Header;
