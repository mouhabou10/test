import React from 'react'
import { IoMdPerson } from "react-icons/io";
import  "./Header.css"
const Header = () => {
  return (
    <nav className='nav-client'>
       <div className='header-container'>
         <div className='icons'>
            <IoMdPerson size={30} />
            <p>Bouchelaghem mohamed</p>
         </div>
      
       </div>
    </nav>
  )
}

export default Header