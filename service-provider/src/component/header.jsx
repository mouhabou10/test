import React from 'react';
import Logo from "./logo.jsx";
import Sidebar from './sidebar.jsx';
import "./header.css";
import  NotificationButton from './NotificationButton.jsx'
const Header= () => {
  return (
    <div className="headers-container">
     <h5 className='namek'>agent labo /scanner</h5>
      <Logo />
      <Sidebar />
      <div style={{ position: "absolute", top: "20px", right: "110px" }}>
  <NotificationButton  />
      </div>
     
      <div className='separation'></div>
    </div>
  );
}

export default Header;
