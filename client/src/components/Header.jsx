import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { IoMdPerson } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineWavingHand } from "react-icons/md";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const [greeting, setGreeting] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  
  useEffect(() => {
    // Set page title based on current path
    const path = location.pathname;
    if (path === '/') setPageTitle('Dashboard');
    else if (path.includes('consultation')) setPageTitle('Consultation');
    else if (path.includes('radio')) setPageTitle('Radiology');
    else if (path.includes('labo')) setPageTitle('Laboratory');
    else if (path.includes('opiration')) setPageTitle('Operation');
    else if (path.includes('result')) setPageTitle('Results');
    else if (path.includes('settings')) setPageTitle('Settings');
    
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    
    // For demo purposes - simulate notifications
    setNotificationCount(Math.floor(Math.random() * 5));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className='nav-client'>
      <div className='header-container'>
        <div className='header-left'>
          <div className='page-titl'>
            <h1>{pageTitle}</h1>
          </div>
          <div className='greeting'>
            <MdOutlineWavingHand className='greeting-icon' />
            <p><span>{greeting},</span> {user.fullName || 'User'}</p>
          </div>
        </div>
        
        <div className='header-right'>
          <div className='search-box'>
            <IoSearchOutline className='search-icon' />
            <input type="text" placeholder="Search..." />
          </div>
          
          <div className='header-actions'>
            <div className='notification-icon'>
              <FaBell />
              {notificationCount > 0 && <span className='notification-badge'>{notificationCount}</span>}
            </div>
            <div className='user-profile'>
              <div className='avatar'>
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div className='logout-icon' onClick={handleLogout}>
              <LuLogOut />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header