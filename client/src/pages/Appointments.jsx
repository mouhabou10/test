import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUserMd, FaHospital, FaFlask, FaXRay } from 'react-icons/fa';
import { MdOutlineLocalHospital } from 'react-icons/md';
import Header from '../components/Header.jsx';
import SideBareClient from '../components/SideBareClient.jsx';

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!token || !user) {
          setError('Please log in to view your appointments');
          navigate('/login');
          return;
        }

        // Get the client ID
        let clientId;
        if (user.client) {
          clientId = user.client; // If client reference exists, use it
        } else if (user._id) {
          clientId = user._id; // Otherwise use the user's ID directly
        } else if (user.userId) {
          clientId = user.userId; // Last resort: use userId if available
        } else {
          // If no ID is found, show an error
          setError('No client ID found for the current user');
          setLoading(false);
          return;
        }
        
        // Fetch all appointments for the client with full population
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/appointments/client/${clientId}/all?populate=true`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch appointments: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Fetched appointments:', data);
        
        if (data.success && Array.isArray(data.data)) {
          setAppointments(data.data);
        } else {
          setAppointments([]);
          console.warn('No appointments found or invalid data format');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error setting up appointments:', err);
        setError('An error occurred while setting up the appointments view');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter(appointment => {
    // Get the appointment type from the real data structure
    const appointmentType = appointment.appointmentType;
    
    if (activeTab === 'all') return true;
    if (activeTab === 'consultation') return appointmentType === 'consultation';
    if (activeTab === 'radio') return appointmentType === 'radio';
    if (activeTab === 'labo') return appointmentType === 'labo';
    if (activeTab === 'operation') return appointmentType === 'operation';
    return true;
  });

  // Get appropriate icon based on appointment type
  const getAppointmentIcon = (appointment) => {
    // Handle both appointmentType (from backend) and type (from sample data)
    const type = appointment.appointmentType || appointment.type;
    
    switch (type) {
      case 'consultation':
        return <FaUserMd size={24} color="#0052E0" />;
      case 'radio':
        return <FaXRay size={24} color="#ff9900" />;
      case 'labo':
        return <FaFlask size={24} color="#3399ff" />;
      case 'operation':
        return <MdOutlineLocalHospital size={24} color="#ff3366" />;
      default:
        return <FaCalendarAlt size={24} color="#0052E0" />;
    }
  };

  // Get status badge class based on appointment status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-badge pending';
      case 'confirmed':
        return 'status-badge confirmed';
      case 'completed':
        return 'status-badge completed';
      case 'cancelled':
        return 'status-badge cancelled';
      default:
        return 'status-badge';
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <section>
      <Header />
      <SideBareClient />
      
      <div style={{ marginLeft: "15%", padding: "20px" }}>
        <h1 style={{ color: "#0052E0", marginBottom: "20px" }}>My Appointments</h1>
        
        {/* Filter buttons */}
        <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
          <button 
            onClick={() => setActiveTab('all')}
            style={{ 
              padding: "8px 16px", 
              borderRadius: "5px", 
              border: "none", 
              backgroundColor: activeTab === "all" ? "#0052E0" : "#f0f0f0",
              color: activeTab === "all" ? "white" : "#333",
              cursor: "pointer"
            }}
          >
            All
          </button>
          <button 
            onClick={() => setActiveTab('consultation')}
            style={{ 
              padding: "8px 16px", 
              borderRadius: "5px", 
              border: "none", 
              backgroundColor: activeTab === "consultation" ? "#0052E0" : "#f0f0f0",
              color: activeTab === "consultation" ? "white" : "#333",
              cursor: "pointer"
            }}
          >
            Consultations
          </button>
          <button 
            onClick={() => setActiveTab('radio')}
            style={{ 
              padding: "8px 16px", 
              borderRadius: "5px", 
              border: "none", 
              backgroundColor: activeTab === "radio" ? "#0052E0" : "#f0f0f0",
              color: activeTab === "radio" ? "white" : "#333",
              cursor: "pointer"
            }}
          >
            Radiology
          </button>
          <button 
            onClick={() => setActiveTab('labo')}
            style={{ 
              padding: "8px 16px", 
              borderRadius: "5px", 
              border: "none", 
              backgroundColor: activeTab === "labo" ? "#0052E0" : "#f0f0f0",
              color: activeTab === "labo" ? "white" : "#333",
              cursor: "pointer"
            }}
          >
            Laboratory
          </button>
          <button 
            onClick={() => setActiveTab('operation')}
            style={{ 
              padding: "8px 16px", 
              borderRadius: "5px", 
              border: "none", 
              backgroundColor: activeTab === "operation" ? "#0052E0" : "#f0f0f0",
              color: activeTab === "operation" ? "white" : "#333",
              cursor: "pointer"
            }}
          >
            Operations
          </button>
        </div>
        
        {/* Appointments table */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "10px", 
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          minHeight: "300px"
        }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ 
                width: "40px", 
                height: "40px", 
                border: "4px solid rgba(0, 82, 224, 0.1)", 
                borderRadius: "50%", 
                borderTop: "4px solid #0052E0", 
                animation: "spin 1s linear infinite", 
                margin: "0 auto" 
              }}></div>
              <p style={{ marginTop: "10px", color: "#666" }}>Loading your appointments...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#dc3545" }}>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                style={{ 
                  marginTop: "15px", 
                  padding: "8px 16px", 
                  backgroundColor: "#0052E0", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "5px", 
                  cursor: "pointer" 
                }}
              >
                Try Again
              </button>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
              <FaCalendarAlt size={48} color="#ccc" />
              <h3 style={{ marginTop: "15px", marginBottom: "10px" }}>No appointments found</h3>
              <p>You don't have any {activeTab !== 'all' ? activeTab : ''} appointments yet.</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ padding: "10px", textAlign: "left" }}>Type</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Provider</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Date & Time</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Details</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => {
                  // Get appointment type
                  const type = appointment.appointmentType || 'unknown';
                  
                  // Helper function to get status color
                  const getStatusColor = (status) => {
                    switch(status.toLowerCase()) {
                      case 'confirmed': return '#4caf50';
                      case 'accepted': return '#4caf50';
                      case 'completed': return '#2196f3';
                      case 'pending': return '#ff9800';
                      case 'cancelled': return '#e53935';
                      default: return '#757575';
                    }
                  };
                  
                  // Format creation date
                  const createdAt = appointment.createdAt
                    ? new Date(appointment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                    : 'Unknown';
                  
                  // Check if document exists
                  const hasDocument = !!appointment.document;
                  
                  return (
                    <tr key={appointment._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "15px 10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          {getAppointmentIcon(appointment)}
                          <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                        </div>
                      </td>
                      <td style={{ padding: "15px 10px" }}>
                        {appointment.serviceProviderId ? 
                          (typeof appointment.serviceProviderId === 'object' ? 
                            appointment.serviceProviderId.name : 
                            'Provider ID: ' + appointment.serviceProviderId) : 
                          'Not assigned'}
                      </td>
                      <td style={{ padding: "15px 10px" }}>
                        <div>{appointment.appointmentDate ? formatDate(appointment.appointmentDate) : 'Not scheduled'}</div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Created: {createdAt}</div>
                      </td>
                      <td style={{ padding: "15px 10px" }}>
                        <span style={{ 
                          display: "inline-block",
                          padding: "5px 10px",
                          borderRadius: "20px",
                          backgroundColor: `${getStatusColor(appointment.status)}20`,
                          color: getStatusColor(appointment.status),
                          fontWeight: "600",
                          fontSize: "12px",
                          textTransform: "uppercase"
                        }}>
                          {appointment.status}
                        </span>
                      </td>
                      <td style={{ padding: "15px 10px" }}>
                        {appointment.serviceProviderId && appointment.serviceProviderId.speciality && 
                          <div><strong>Specialty:</strong> {appointment.serviceProviderId.speciality}</div>}
                        {hasDocument && 
                          <div style={{ marginTop: '5px' }}>
                            <strong>Prescription:</strong> <span style={{ color: '#28a745' }}>Uploaded</span>
                          </div>
                        }
                        {appointment.notes && <div><strong>Notes:</strong> {appointment.notes}</div>}
                      </td>
                      <td style={{ padding: "15px 10px", textAlign: "right" }}>
                        <button 
                          onClick={() => navigate(`/appointment/${appointment._id}`)}
                          style={{ 
                            padding: "6px 12px", 
                            backgroundColor: "#0052E0", 
                            color: "white", 
                            border: "none", 
                            borderRadius: "5px", 
                            marginRight: "5px",
                            cursor: "pointer"
                          }}
                        >
                          View
                        </button>
                        
                        {appointment.status === 'pending' && (
                          <button 
                            style={{ 
                              padding: "6px 12px", 
                              backgroundColor: "transparent", 
                              color: "#e53935", 
                              border: "1px solid #e53935", 
                              borderRadius: "5px",
                              cursor: "pointer"
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Add CSS for the spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </section>
  );
};

export default Appointments;
