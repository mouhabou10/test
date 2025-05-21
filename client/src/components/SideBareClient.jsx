import React from 'react'
import { AiOutlineDashboard } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosRadio } from "react-icons/io";
import { GiMicroscope } from "react-icons/gi";
import { FaHospitalUser } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import { MdPendingActions } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';

const SideBare = () => {
  // Get current location to determine active page
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Function to check if a path is active
  const isActive = (path) => {
    if (path === '/' && currentPath === '/') {
      return true;
    }
    return path !== '/' && currentPath.startsWith(path);
  };
  
  // Navigation items configuration
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <AiOutlineDashboard size={22} /> },
    { path: '/consultation', label: 'Consultation', icon: <FaHospitalUser size={22} /> },
    { path: '/radio', label: 'Radiology', icon: <IoIosRadio size={22} /> },
    { path: '/labo', label: 'Laboratory', icon: <GiMicroscope size={22} /> },
    { path: '/opiration', label: 'Operation', icon: <FaHospitalUser size={22} /> },
    { path: '/appointments', label: 'Appointments', icon: <FaCalendarAlt size={22} /> },
    { path: '/requests', label: 'Requests', icon: <MdPendingActions size={22} /> },
    { path: '/result', label: 'Results', icon: <MdOutlineFileDownload size={22} /> },
    { path: '/settings/:id', label: 'Settings', icon: <IoSettingsOutline size={22} /> }
  ];
  
  return (
    <div className='sidebar'>
      <ul className='ul-deisgn'>
        {navItems.map((item, index) => (
          <li key={index} className={`li-deign ${isActive(item.path) ? 'active' : ''}`}>
            <Link to={item.path}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default SideBare