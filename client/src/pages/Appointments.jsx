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

        // Since we don't have a direct API endpoint for all appointments,
        // we'll use sample data to demonstrate the UI
        const sampleAppointments = [
          {
            _id: 'sample-1',
            type: 'consultation',
            status: 'confirmed',
            provider: { name: 'Dr. Sarah Johnson' },
            appointmentDate: new Date(Date.now() + 86400000), // tomorrow
            specialty: 'Cardiology',
            location: 'Main Hospital, Floor 3, Room 302'
          },
          {
            _id: 'sample-2',
            type: 'radio',
            status: 'completed',
            provider: { name: 'Algiers Radiology Center' },
            appointmentDate: new Date(Date.now() - 604800000), // a week ago
            location: 'Radiology Wing, Floor 1'
          },
          {
            _id: 'sample-3',
            type: 'labo',
            status: 'confirmed',
            provider: { name: 'Central Laboratory' },
            appointmentDate: new Date(Date.now() + 172800000), // day after tomorrow
            notes: 'Fasting required 8 hours before test'
          },
          {
            _id: 'sample-4',
            type: 'operation',
            status: 'pending',
            provider: { name: 'University Hospital' },
            appointmentDate: new Date(Date.now() + 1209600000), // two weeks from now
            specialty: 'Orthopedic Surgery',
            notes: 'Pre-operation consultation required'
          },
          {
            _id: 'sample-5',
            type: 'consultation',
            status: 'pending',
            provider: { name: 'Dr. Ahmed Benali' },
            appointmentDate: new Date(Date.now() + 345600000), // 4 days from now
            specialty: 'Dermatology',
            location: 'Medical Center, Floor 2'
          },
          {
            _id: 'sample-6',
            type: 'radio',
            status: 'confirmed',
            provider: { name: 'Modern Imaging Center' },
            appointmentDate: new Date(Date.now() + 518400000), // 6 days from now
            notes: 'MRI scan of left knee'
          }
        ];
        
        setAppointments(sampleAppointments);
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
    // Handle both appointmentType (from backend) and type (from sample data)
    const appointmentType = appointment.appointmentType || appointment.type;
    
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
      
      <div style={{ marginLeft: "20%", padding: "20px" }}>
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
                  // Get appointment type (handle both data structures)
                  const type = appointment.appointmentType || appointment.type;
                  
                  // Get status badge color
                  const getStatusColor = (status) => {
                    switch(status) {
                      case 'pending': return '#ffa000';
                      case 'confirmed': return '#43a047';
                      case 'completed': return '#1976d2';
                      case 'cancelled': return '#e53935';
                      default: return '#757575';
                    }
                  };
                  
                  return (
                    <tr key={appointment._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "15px 10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          {getAppointmentIcon(appointment)}
                          <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                        </div>
                      </td>
                      <td style={{ padding: "15px 10px" }}>
                        {appointment.provider ? appointment.provider.name : 
                         appointment.serviceProviderId ? appointment.serviceProviderId.name : 
                         'Not assigned'}
                      </td>
                      <td style={{ padding: "15px 10px" }}>
                        {appointment.appointmentDate ? formatDate(appointment.appointmentDate) : 'Not scheduled'}
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
                        {appointment.specialty && <div><strong>Specialty:</strong> {appointment.specialty}</div>}
                        {appointment.location && <div><strong>Location:</strong> {appointment.location}</div>}
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
