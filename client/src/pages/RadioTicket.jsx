import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const RadioTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointmentData, setAppointmentData] = useState(null);
  const [userName, setUserName] = useState("Patient");
  const [showTicketOption, setShowTicketOption] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle booking a ticket
  const handleBookTicket = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user data and token
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token || !user?._id) {
        setError('Please log in to create a ticket');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }
      
      if (!appointmentData || !appointmentData.serviceProviderId) {
        setError('Service provider information is missing');
        return;
      }
      
      // Create a ticket
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/tickets/create`,
        {
          serviceProvider: appointmentData.serviceProviderId._id,
          client: user._id,
          speciality: 'Radiology'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        // Store ticket data in localStorage for the OnlineTicket component
        localStorage.setItem('currentTicket', JSON.stringify({
          ...response.data.data,
          appointmentType: 'radio',
          appointmentData
        }));
        
        // Navigate to the online ticket page
        navigate(`/radio/radio-ticket/${id}/online-ticket`);
      } else {
        throw new Error(response.data.message || 'Failed to create ticket');
      }
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get user data if available
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.fullName) {
          setUserName(user.fullName);
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    // Get appointment data if available
    const appointmentStr = localStorage.getItem('radioAppointment');
    if (appointmentStr) {
      try {
        const appointment = JSON.parse(appointmentStr);
        setAppointmentData(appointment);
        
        // Check if the appointment status is accepted
        if (appointment.status && appointment.status.toLowerCase() === 'accepted') {
          setShowTicketOption(true);
        }
      } catch (e) {
        console.error('Error parsing appointment data:', e);
      }
    }
  }, []);

  return (
    <section className="ticket-page-container">
      {showTicketOption ? (
        <div className="ticket-booking-container">
          <div className="ticket-header">
            <h1>Radio Appointment Ticket</h1>
            <div className="ticket-icon">
              <i className="fas fa-x-ray"></i>
            </div>
          </div>
          
          <div className="ticket-booking-content">
            <div className="ticket-status accepted">
              <div className="status-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="status-text">
                <h3>Request Accepted</h3>
                <p>Your radiology appointment request has been approved!</p>
              </div>
            </div>
            
            <div className="ticket-booking-info">
              <h2>Book Your Ticket</h2>
              <p>
                You can now book a ticket for your radiology appointment. This will allow you to
                check in at the hospital and receive your service without waiting in line.
              </p>
              
              {loading ? (
                <button className="booking-button loading" disabled>
                  <div className="button-spinner"></div>
                  Creating Ticket...
                </button>
              ) : error ? (
                <div className="booking-error">
                  <div className="error-icon"><i className="fas fa-exclamation-circle"></i></div>
                  <p>{error}</p>
                </div>
              ) : (
                <button className="booking-button" onClick={handleBookTicket}>
                  Book Now
                </button>
              )}
            </div>
            
            <div className="ticket-note">
              <div className="note-header">
                <i className="fas fa-info-circle"></i>
                <h3>Important Information</h3>
              </div>
              <ul className="note-content">
                <li>This booking is valid for only <strong>5 days</strong> from {new Date().toLocaleDateString()}</li>
                <li>Please arrive 15 minutes before your scheduled appointment</li>
                <li>Bring your ID card and any previous medical records</li>
                <li>The radiology department is located on the 2nd floor</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="request-confirmation-container">
          <div className="confirmation-icon">
            <div className="icon-circle">
              <i className="fas fa-check"></i>
            </div>
          </div>
          
          <div className="confirmation-content">
            <h2>Request Successfully Submitted</h2>
            <h3>Hello, {userName}</h3>
            
            <div className="confirmation-message">
              <p>
                Your radiology prescription has been successfully uploaded. Our medical team will review 
                your prescription as soon as possible and process your request.
              </p>
              <p className="highlight-message">
                <i className="fas fa-bell"></i>
                You will receive a notification when your request has been processed.
              </p>
            </div>
            
            <div className="confirmation-actions">
              <Link to="/" className="primary-button">
                <i className="fas fa-home"></i> Return to Dashboard
              </Link>
              <Link to="/appointments" className="secondary-button">
                <i className="fas fa-calendar-check"></i> View My Appointments
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RadioTicket;
