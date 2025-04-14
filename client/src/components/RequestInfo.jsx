import React from 'react'

const RequestInfo = () => {
    
    const Request = "blood test"
    const status = "Accepted"
  return (
    <div className='RequestInfo-card'>
        <p> {Request} </p>
        <p> {status} </p>
    </div>
  )
}

export default RequestInfo