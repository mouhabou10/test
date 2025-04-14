import React from "react";
import "./HomeHeader.css"; // استيراد ملف الـ CSS
import Logo from "./logo.jsx";
import { Link } from 'react-router-dom';  
const HomeHeader = () => {
  return (
<header className="header-home">
  <div className="logo-container">
  <Logo style={{ color: "blue" }} />

  </div>

  <nav>
    <ul className="nav-links">
      <li><Link to="/">home</Link></li>
      <li><Link to="/">about us</Link></li>
      <li><Link to="/">support</Link></li>
      <li><Link to="/settings">settings</Link></li>
    </ul>
  </nav>
  <button className="signup-btn">sign up</button>
</header>
  );
};

export default HomeHeader;







