import React from 'react'
import { AiOutlineDashboard } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosRadio } from "react-icons/io";
import { Link } from 'react-router-dom';
const SideBare = () => {

  
  return (
    <div className='sidebar'>
      <ul className='ul-deisgn'> 
        <li className='li-deign'> <Link to="/"><AiOutlineDashboard size={30}/> Home</Link></li>
        <li className='li-deign'> <Link to="/consultation"><IoSettingsOutline size={30}/> consultation</Link></li>
        <li className='li-deign'> <Link to="/radio"><IoIosRadio size={30}/> Radio</Link></li>
        <li className='li-deign'> <Link to="/labo"><AiOutlineDashboard size={30}/> Lab</Link></li>
        <li className='li-deign'> <Link to="/opiration"><IoIosRadio size={30}/> Operation</Link></li>
        <li className='li-deign'> <Link to="/result" ><IoSettingsOutline size={30}/> Result</Link></li>
        <li className='li-deign'> <Link to="/settings/:id"><IoSettingsOutline size={30}/> setting</Link></li>
      </ul>
    </div>
  )
}
export default SideBare