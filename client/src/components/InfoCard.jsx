import React from 'react'
import Doctor from '../images/doctor.png'
import Scope from '../images/stethoscope.png'

const InfoCard = () => {
  return (
    <div className='card-container'>
        <img src={Doctor} alt='doctor' />
            <p> welcome back mr mohamed <br/>
                 <p style={{ fontSize: "15px" }}>upgrade your experience</p>
            </p>
        <img src={Scope} alt='Scope' />
    </div>
  )
}

export default InfoCard