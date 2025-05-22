import React from 'react';
import { FaHospital, FaFlask, FaXRay, FaCalendarAlt, FaClock, FaUserMd, FaTicketAlt } from 'react-icons/fa';
import { MdPending } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const RequestInfo = ({ appointment }) => {
  const navigate = useNavigate();
  // If no appointment is provided, return null or a placeholder
  if (!appointment) {
    return (
      <div className='RequestInfo-card' style={styles.emptyCard}>
        <p style={styles.emptyText}>No appointment data</p>
      </div>
    );
  }
  
  // Format the date if available
  const formattedDate = appointment.appointmentDate 
    ? new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'Not specified';

  // Format time if available
  const formattedTime = appointment.appointmentDate
    ? new Date(appointment.appointmentDate).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : '';
  
  // Format creation date if available
  const createdAt = appointment.createdAt
    ? new Date(appointment.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'Unknown';
  
  // Get provider name if available
  const providerName = appointment.serviceProviderId?.name || 'Unknown provider';
  const providerType = appointment.serviceProviderId?.type || '';
  
  // Get document ID if available
  const hasDocument = !!appointment.document;
  
  // Get notes if available
  const notes = appointment.notes || 'No additional notes';
  
  // Get type-specific data
  const getTypeInfo = (type) => {
    switch(type.toLowerCase()) {
      case 'radio':
        return {
          color: '#ff9900',
          bgColor: '#fff9e6',
          icon: <FaXRay size={24} />,
          label: 'Radiology'
        };
      case 'labo':
        return {
          color: '#3399ff',
          bgColor: '#e6f2ff',
          icon: <FaFlask size={24} />,
          label: 'Laboratory'
        };
      case 'operation':
        return {
          color: '#ff3366',
          bgColor: '#ffe6eb',
          icon: <FaHospital size={24} />,
          label: 'Operation'
        };
      default:
        return {
          color: '#cccccc',
          bgColor: '#f5f5f5',
          icon: <MdPending size={24} />,
          label: 'Request'
        };
    }
  };
  
  const typeInfo = getTypeInfo(appointment.appointmentType);
  
  // Get status badge style
  const getStatusStyle = (status) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return {
          color: '#ff9900',
          bgColor: '#fff9e6',
          borderColor: '#ffcc66'
        };
      case 'accepted':
      case 'confirmed':
        return {
          color: '#33cc66',
          bgColor: '#e6fff0',
          borderColor: '#99e6b3'
        };
      case 'cancelled':
        return {
          color: '#ff3366',
          bgColor: '#ffe6eb',
          borderColor: '#ff99aa'
        };
      case 'completed':
        return {
          color: '#3399ff',
          bgColor: '#e6f2ff',
          borderColor: '#99ccff'
        };
      default:
        return {
          color: '#999999',
          bgColor: '#f5f5f5',
          borderColor: '#dddddd'
        };
    }
  };
  
  const statusStyle = getStatusStyle(appointment.status);

  // Function to handle ticket button click
  const handleGetTicket = () => {
    // Save appointment data to localStorage
    if (appointment.appointmentType.toLowerCase() === 'radio') {
      localStorage.setItem('radioAppointment', JSON.stringify(appointment));
      navigate(`/radio/radio-ticket/${appointment._id}`);
    } else if (appointment.appointmentType.toLowerCase() === 'labo') {
      localStorage.setItem('laboAppointment', JSON.stringify(appointment));
      navigate(`/labo/labo-ticket/${appointment._id}`);
    }
  };

  // Check if appointment is eligible for ticket (radio or labo with accepted status)
  const isTicketEligible = 
    appointment.status.toLowerCase() === 'accepted' && 
    (appointment.appointmentType.toLowerCase() === 'radio' || 
     appointment.appointmentType.toLowerCase() === 'labo');
  
  return (
    <div 
      className='RequestInfo-card' 
      data-type={appointment.appointmentType.toLowerCase()}
      style={{
        ...styles.card,
        borderLeft: `4px solid ${typeInfo.color}`
      }}
    >
      <div style={styles.typeIcon} className="request-type-icon">
        <div style={{ ...styles.iconCircle, backgroundColor: typeInfo.bgColor, color: typeInfo.color }}>
          {typeInfo.icon}
        </div>
      </div>
      
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h3 style={styles.title}>{typeInfo.label} Request</h3>
          <div 
            style={{
              ...styles.statusBadge,
              backgroundColor: statusStyle.bgColor,
              color: statusStyle.color,
              borderColor: statusStyle.borderColor
            }}
          >
            {appointment.status.toUpperCase()}
          </div>
        </div>
        
        <div style={styles.details}>
          <div style={styles.detailItem}>
            <FaUserMd style={styles.detailIcon} />
            <span style={styles.detailLabel}>Provider:</span>
            <span style={styles.detailValue}>{providerName}</span>
            {providerType && (
              <span style={styles.providerType}>{providerType}</span>
            )}
          </div>
          
          <div style={styles.detailItem}>
            <FaCalendarAlt style={styles.detailIcon} />
            <span style={styles.detailLabel}>Appointment Date:</span>
            <span style={styles.detailValue}>{formattedDate}</span>
          </div>
          
          {formattedTime && (
            <div style={styles.detailItem}>
              <FaClock style={styles.detailIcon} />
              <span style={styles.detailLabel}>Time:</span>
              <span style={styles.detailValue}>{formattedTime}</span>
            </div>
          )}
          
          <div style={styles.detailItem}>
            <FaCalendarAlt style={styles.detailIcon} />
            <span style={styles.detailLabel}>Created On:</span>
            <span style={styles.detailValue}>{createdAt}</span>
          </div>
          
          {hasDocument && (
            <div style={styles.detailItem}>
              <i className="fas fa-file-medical" style={styles.detailIcon}></i>
              <span style={styles.detailLabel}>Prescription:</span>
              <span style={{...styles.detailValue, color: '#28a745'}}>Uploaded</span>
              <button 
                onClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/documents/${appointment.document}`, '_blank')}
                style={styles.viewDocButton}
              >
                <i className="fas fa-eye" style={{marginRight: '5px'}}></i>
                View
              </button>
            </div>
          )}
          
          {notes && notes !== 'No additional notes' && (
            <div style={{...styles.detailItem, alignItems: 'flex-start'}}>
              <i className="fas fa-sticky-note" style={{...styles.detailIcon, marginTop: '3px'}}></i>
              <span style={styles.detailLabel}>Notes:</span>
              <span style={{...styles.detailValue, flex: 1}}>{notes}</span>
            </div>
          )}

          {/* Ticket button for accepted radio and labo appointments */}
          {isTicketEligible && (
            <div style={styles.ticketButtonContainer}>
              <button 
                onClick={handleGetTicket}
                style={styles.ticketButton}
              >
                <FaTicketAlt style={styles.ticketIcon} />
                Get Ticket
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Styles object
const styles = {
  emptyCard: {
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  emptyText: {
    color: '#999',
    fontSize: '14px'
  },
  card: {
    display: 'flex',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    padding: '16px',
    marginBottom: '16px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    overflow: 'hidden',
    position: 'relative'
  },
  typeIcon: {
    marginRight: '16px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  iconCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#333'
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '50px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid',
    letterSpacing: '0.5px'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px'
  },
  detailIcon: {
    marginRight: '8px',
    color: '#666',
    fontSize: '14px'
  },
  detailLabel: {
    color: '#666',
    marginRight: '4px',
    fontWeight: '500'
  },
  detailValue: {
    color: '#333',
    fontWeight: '400'
  },
  providerType: {
    marginLeft: '8px',
    padding: '2px 8px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#666'
  },
  ticketButtonContainer: {
    marginTop: '12px',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  ticketButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  ticketIcon: {
    fontSize: '16px'
  },
  viewDocButton: {
    marginLeft: '10px',
    padding: '3px 8px',
    backgroundColor: '#0052E0',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'all 0.2s ease'
  }
};

export default RequestInfo;