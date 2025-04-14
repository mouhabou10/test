import React from 'react'
import logo from '../images/logo.jpg';
import { Link } from 'react-router-dom'; 
import './logo.css';
const Logo = ({ color = "blue" }) => {
  return (
    <div className='logo'>
      <Link to="/"> 
        <img className='logoimg' src={logo} alt="Logo" />
        <h5 style={{ color }} className='logotx'>AlgiCare</h5>
      </Link>
    </div>
  );
};


export default Logo