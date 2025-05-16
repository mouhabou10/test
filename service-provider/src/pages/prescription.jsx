
import React from 'react'
import Sidebar from '../component/sidebar.jsx'

import './pages.css'
import PrescriptionList from '../component/prescriptionList.jsx'
import Headerservice from '../component/header.jsx'
const Prescription = () => {
  return (
    <div>
    <Headerservice/>
    <p className='perton'>Prescriptions dashbord</p>
    <PrescriptionList/>
   
    </div>
  )
}
export default Prescription