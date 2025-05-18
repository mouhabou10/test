import React from 'react'
import Doctor from '../images/doctor.png'
import Scope from '../images/stethoscope.png'

const InfoCard = () => {
  return (
    <div className='card-container'>
        <img src={Doctor} alt='doctor' />            <div className="welcome-text">
                <p>welcome back mr mohamed</p>
                <span style={{ fontSize: "15px" }}>upgrade your experience</span>
            </div>
        <img src={Scope} alt='Scope' />
    </div>
  )
}

export default InfoCard