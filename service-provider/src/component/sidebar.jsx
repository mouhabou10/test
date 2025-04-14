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
        <Logo className="logo"/>
        <ul>
          <li><Link to="/">📞 support</Link></li>
          <li><Link to="/">📁 About</Link></li>
          <li><Link to="/">📃 Result</Link></li>
          <li><Link to="/">⚙️ Settings</Link></li>
        </ul>
      </div>

      {/* Overlay when sidebar is open */}
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default Sidebar;
