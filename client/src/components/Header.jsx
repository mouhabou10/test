import React from 'react'
import { IoMdPerson } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
const Header = () => {
  return (
    <nav className='nav-client'>
       <div className='header-container'>
         <div className='icons'>
            <IoMdPerson size={30} />
            <p>Bouchelaghem mohamed</p>
         </div>
         <div className='icons'>
            <FaBell size={30} />
            <LuLogOut size={30} />
         </div>
       </div>
    </nav>
  )
}

export default Header