import React from 'react'
import { IoMdPerson } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import NotificationButton from "../components/NotificationButton.jsx"
import  "./Header.css"
const Header = () => {
  return (
    <nav className='nav-client'>
       <div className='header-container'>
       <NotificationButton className="notifyuser"/>
         <div className='icons'>
            <IoMdPerson size={30} />
            <p>Bouchelaghem mohamed</p>
         </div>
      
       </div>
    </nav>
  )
}

export default Header