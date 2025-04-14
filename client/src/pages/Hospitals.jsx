import React from 'react'
import Header from '../components/Header.jsx'
import HospitalCardList from '../components/HospitalCardList'
import SideBareClient from '../components/SideBareClient.jsx'
const Hospitals = () => {
  return (
    <div>      
       <SideBareClient/>
       <Header/>
       <HospitalCardList/>
       </div>
  )
}

export default Hospitals