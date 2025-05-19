import React, { useState } from "react";
import "./sidebar.css";
import { Link } from 'react-router-dom'; 
import Logo from "./logo.jsx";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Icon */}
      <div
        className={`hamburger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="one"></div>
        <div className="two"></div>
        <div className="three"></div>
      </div>
   
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <Logo className="logo" />
        <ul>
          <li><Link to='/Tiket'><span>🎟️ Tiket</span></Link></li>
          <li><Link to="/result"><span>📃 Results</span></Link></li>
          <li><Link to='/refferalletters'><span>📨 Refferal Letters</span></Link></li>
          <li><Link to='/prescription'><span>💊 Prescriptions</span></Link></li>
          <li><Link to='/staff-manager'><span>🧑‍💼 Staff Management</span></Link></li>
          <li><Link to='/'><span>🛠️ Service Management</span></Link></li>
          <li><Link to='/account-demande-list'><span>📋 Account Demand List</span></Link></li>
          <li><Link to="/contactus"><span>📞 Support</span></Link></li>
          <li><Link to="/aboutus"><span>📁 About</span></Link></li>
          <li><Link to="/setting"><span>⚙️ Settings</span></Link></li>
        </ul>
      </div>

      {/* Overlay when sidebar is open */}
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default Sidebar;
