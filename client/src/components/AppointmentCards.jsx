import React from 'react'

const AppointmentCards = () => {

    const date = "01 jun 25"
    const time = "9:00 Am"
    const type = "Consultation"
    const place = "beni masouse"
    const type2 = "hospital"


  return (
    <div className='appointment-card'>
        <div><p style={{fontSize:"larger"}}>{date}</p> <p style={{color:"#808080"}}>{time}</p></div>
        <div className='line'></div>
        <div><p style={{fontSize:"larger"}}>Type</p> <p style={{color:"#808080"}}>{type}</p></div>
        <div className='line'></div>
        <div><p style={{fontSize:"larger"}}>place</p> <p  style={{color:"#808080"}}> {type2} </p> </div>
        <div className='line'></div>
        <div><p style={{fontSize:"larger"}}> name </p><p style={{color:"#808080"}}> {place} </p> </div>
    </div>
  )
}

export default AppointmentCards