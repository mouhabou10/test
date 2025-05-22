import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define the API URL - use a direct URL to avoid environment variable issues
const API_URL = 'http://localhost:3000';

// Create a static variable outside the component to track created tickets across remounts
const createdTickets = {};

const ConsultationTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add a ref to track if a ticket creation request is in progress
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  // Use a ref to track if this component has already created a ticket for this ID
  const hasCreatedTicketRef = useRef(false);

  useEffect(() => {
    console.log('=== ConsultationTicket Component Mounted ===');
    console.log('Ticket ID from URL:', id);
    
    const createOrGetTicket = async () => {
      console.log('Starting createOrGetTicket function...');
      
      // Check if we've already created a ticket for this ID in this session (using static variable)
      if (createdTickets[id]) {
        console.log('Ticket already created for this ID in this session, using existing ticket');
        setTicketData(createdTickets[id]);
        setLoading(false);
        return;
      }
      
      // Check if this component instance has already created a ticket (using ref)
      if (hasCreatedTicketRef.current) {
        console.log('This component instance has already created a ticket, skipping duplicate creation');
        setLoading(false);
        return;
      }
      
      // Check if a ticket creation is already in progress
      if (isCreatingTicket) {
        console.log('Ticket creation already in progress, skipping duplicate request');
        return;
      }
      
      // Set the flag to indicate that ticket creation is in progress
      setIsCreatingTicket(true);
      try {
        const token = localStorage.getItem('token');
        console.log('Token retrieved from localStorage:', token ? 'Token exists' : 'No token found');
        
        const userStr = localStorage.getItem('user');
        console.log('User string from localStorage:', userStr ? 'User data exists' : 'No user data found');
        
        const user = JSON.parse(userStr || '{}');
        console.log('Parsed user data:', user);
        console.log('User ID:', user._id);
        
        const existingTicket = localStorage.getItem(`ticket_${id}`);
        console.log('Existing ticket in localStorage:', existingTicket ? 'Found' : 'Not found');
        
        // Get the search parameters to access the selected specialty
        const searchParamsStr = localStorage.getItem('consultationSearchParams');
        console.log('Search params string:', searchParamsStr);
        
        const searchParams = searchParamsStr ? JSON.parse(searchParamsStr) : null;
        console.log('Parsed search params:', searchParams);
        
        const speciality = searchParams?.category || 'General';
        console.log('Selected speciality:', speciality);
        
        if (!token || !user?._id) {
          console.log('No token or user ID found, redirecting to login');
          setError('Please log in to create a ticket.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setTimeout(() => {
            navigate('/login', { state: { from: `/consultation/ticket/${id}` } });
          }, 2000);
          return;
        }

        // We now always create a new ticket, even if one exists in localStorage
        if (existingTicket) {
          console.log('Existing ticket found in localStorage, but creating a new one anyway');
          // Remove the existing ticket from localStorage to avoid confusion
          localStorage.removeItem(`ticket_${id}`);
        }
        
        console.log('No existing ticket found, creating a new one');
        console.log('Creating ticket with speciality:', speciality);
        
        // Use the direct API URL defined at the top of the file
        console.log('Creating ticket with API URL:', API_URL);
        
        // Prepare request data
        const requestData = {
          serviceProvider: id,
          client: user._id,
          speciality: speciality,
          ticketType: 'consultation'
        };
        console.log('Request data:', requestData);
        
        // Prepare headers
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        console.log('Request headers:', headers);
        
        console.log('Sending API request to create ticket...');
        try {
          const response = await axios.post(
            `${API_URL}/api/v1/tickets/create`,
            requestData,
            { headers }
          );
          
          console.log('API response received:', response.status);
          console.log('Response data:', response.data);
          
          if (response.data.success) {
            console.log('Ticket created successfully');
            const newTicketData = response.data.data;
            console.log('New ticket data:', newTicketData);
            
            // Store the ticket data in localStorage and state
            localStorage.setItem(`ticket_${id}`, JSON.stringify(newTicketData));
            console.log('Ticket data saved to localStorage');
            
            // Mark this ticket as created in our tracking mechanisms
            createdTickets[id] = newTicketData;
            hasCreatedTicketRef.current = true;
            console.log('Ticket marked as created in tracking mechanisms');
            
            setTicketData(newTicketData);
            setError(null);
          } else {
            console.error('API returned success: false');
            throw new Error(response.data.message || 'Failed to create ticket');
          }
        } catch (apiError) {
          console.error('API request error:', apiError);
          throw apiError;
        }
      } catch (err) {
        console.error('Error creating ticket:', err);
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
          response: err.response ? {
            status: err.response.status,
            statusText: err.response.statusText,
            data: err.response.data
          } : 'No response data'
        });
        
        if (err.response?.status === 401) {
          console.log('401 Unauthorized error - clearing token and redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setError('Your session has expired. Please log in again.');
          setTimeout(() => {
            navigate('/login', { state: { from: `/consultation/ticket/${id}` } });
          }, 2000);
        } else if (err.response?.status === 404) {
          console.log('404 Not Found error - provider or user not found');
          setError('Provider or user not found. Please try again.');
        } else if (err.response?.status === 500) {
          console.log('500 Server error');
          setError('A server error occurred. Please try again later.');
        } else {
          console.log('Other error:', err.response?.data?.message || err.message || 'Failed to create ticket');
          setError(err.response?.data?.message || err.message || 'Failed to create ticket');
        }
      } finally {
        setLoading(false);
        // Reset the ticket creation flag
        setIsCreatingTicket(false);
      }
    };

    createOrGetTicket();
    
    // Cleanup function to prevent memory leaks
    return () => {
      console.log('ConsultationTicket component unmounting');
    };
  }, []); // Empty dependency array to ensure this effect runs only once

  if (loading) {
    return (
      <div className="consultation-ticket loading">
        <div className="loading-spinner"></div>
        <p>Creating your ticket...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="consultation-ticket error">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          {error.includes('log in') && (
            <button 
              onClick={() => navigate('/login', { state: { from: `/consultation/ticket/${id}` } })}
              className="login-button"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!ticketData) {
    return <div className="consultation-ticket">No ticket data available</div>;
  }

  const estimatedWaitingTime = ticketData.waitingCount * 15; // 15 minutes per person

  return (
    <div className="consultation-ticket">
      <div className="ticket-header-text">
        <div className="header-title">RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE</div>
        <div className="header-subtitle">Ministère de la Santé</div>
        <div className="hospital-name">{ticketData.serviceProvider?.name}</div>
      </div>

      <div className="ticket-number-section">
        <div className="waiting-info">
          People Waiting: <span className="highlight">{ticketData.waitingCount}</span>
        </div>
        <div className="number-circle">
          <div className="number">{ticketData.number}</div>
        </div>
        <div className="waiting-info">
          Estimated Time: <span className="highlight">{Math.floor(estimatedWaitingTime / 60)}h {estimatedWaitingTime % 60}min</span>
        </div>
      </div>

      <div className="ticket-details">
        <div className="detail-row">
          <p><strong>Nom et Prénom:</strong> {JSON.parse(localStorage.getItem('user') || '{}').fullName}</p>
        </div>
        <div className="detail-row">
          <p><strong>Spécialité:</strong> {ticketData.selectedSpecialty || ticketData.serviceProvider?.speciality || 'Consultation'}</p>
        </div>
        <div className="detail-row">
          <p><strong>Date de création:</strong> {new Date(ticketData.createdAt).toLocaleString('fr-DZ')}</p>
        </div>
      </div>

      <div className="validity-info">
        Ce ticket n'est valable que pour aujourd'hui. Veuillez arriver au moins 10 minutes avant votre tour.
      </div>

      <div className="ticket-footer">
        <div className="important-note">Instructions Importantes:</div>
        <ul className="instructions">
          <li>Gardez ce ticket avec vous jusqu'à votre tour</li>
          <li>Restez dans la salle d'attente</li>
          <li>Écoutez l'appel de votre numéro</li>
          <li>Votre ticket sera annulé si vous manquez votre tour</li>
          <li>En cas d'urgence, veuillez vous adresser à l'accueil</li>
        </ul>
      </div>
    </div>
  );
};

export default ConsultationTicket;
