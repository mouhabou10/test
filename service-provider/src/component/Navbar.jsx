import React from "react";
import "./Navbar.css";
const Navbar = () => {
  return (
    <nav className="navbar">
      <h3>Agent ticket</h3>
      <div className="profile">
        <span>🔔</span>
        <span className="avatar">A</span>
      </div>
    </nav>
  );
  
};

export default Navbar;