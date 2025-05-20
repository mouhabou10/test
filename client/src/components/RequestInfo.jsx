import React from 'react'

const RequestInfo = ({ appointment }) => {
  // If no appointment is provided, return null or a placeholder
  if (!appointment) {
    return (
      <div className='RequestInfo-card'>
        <p>No appointment data</p>
      </div>
    );
  }
  
  // Format the date if available
  const formattedDate = appointment.appointmentDate 
    ? new Date(appointment.appointmentDate).toLocaleDateString() 
    : 'Not specified';
  
  // Get provider name if available
  const providerName = appointment.serviceProviderId?.name || 'Unknown provider';
  
  // Add debug border color based on appointment type
  const getTypeColor = (type) => {
    switch(type.toLowerCase()) {
      case 'radio': return '#ff9900';
      case 'labo': return '#3399ff';
      case 'operation': return '#ff3366';
      default: return '#cccccc';
    }
  };
  
  const borderColor = getTypeColor(appointment.appointmentType);
  
  return (
    <div className='RequestInfo-card' data-type={appointment.appointmentType.toLowerCase()}>
      <div className='request-info-left'>
        <p className='request-type'>
          {appointment.appointmentType.toUpperCase()} 
        </p>
        <p className='request-provider'>{providerName}</p>
        <p className='request-date'>{formattedDate}</p>
      </div>
      <div className='request-info-right'>
        <p className='request-status'>{appointment.status.toUpperCase()}</p>
      </div>
    </div>
  )
}

export default RequestInfo