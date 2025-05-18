import React from 'react'
import { useNavigate } from 'react-router-dom';
import { IoMdPerson } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className='nav-client'>
       <div className='header-container'>
         <div className='icons'>
            <IoMdPerson size={30} />
            <p>{user.fullName || 'User'}</p>
         </div>
         <div className='icons'>
            <FaBell size={30} />
            <LuLogOut size={30} style={{ cursor: 'pointer' }} onClick={handleLogout} />
         </div>
       </div>
    </nav>
  )
}

export default Header