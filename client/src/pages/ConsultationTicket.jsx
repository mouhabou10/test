import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define the API URL - use environment variable or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Global tracking of ticket creation requests to prevent duplicates across sessions
// This is a static variable that persists across component remounts
const pendingTicketRequests = new Map();
const createdTickets = new Map();

// Create a throttle function to prevent multiple rapid calls
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const ConsultationTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use refs to track the ticket creation state to prevent race conditions
  const isCreatingTicketRef = useRef(false);
  const hasCheckedDatabaseRef = useRef(false);
  const requestIdRef = useRef(`${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  useEffect(() => {
    if (!ticketData) return;
  
    const waitingCount = ticketData.waitingCount;
  
    if (isNaN(waitingCount) || waitingCount === 0) {
      alert("🟢 Votre tour est arrivé !");
    } else if (waitingCount > 0 && waitingCount < 5) {
      alert("🟡 Approchez-vous, votre tour est proche !");
    }
  }, [ticketData]);
  
  useEffect(() => {
    console.log('=== ConsultationTicket Component Mounted ===');
    console.log('Ticket ID from URL:', id);
    
    // Generate a unique request ID for this ticket creation attempt
    const requestId = requestIdRef.current;
    console.log('Request ID:', requestId);
    
    // Check if there's already a pending request for this service provider
    if (pendingTicketRequests.has(id)) {
      console.log('There is already a pending request for this service provider');
      
      // Wait for the pending request to complete
      const checkInterval = setInterval(() => {
        if (!pendingTicketRequests.has(id)) {
          clearInterval(checkInterval);
          
          // Check if a ticket was created by the other request
          if (createdTickets.has(id)) {
            console.log('Ticket was created by another request, using that ticket');
            setTicketData(createdTickets.get(id));
            setLoading(false);
          } else {
            // If no ticket was created, proceed with our own request
            console.log('No ticket was created by the other request, proceeding with our own');
            createOrGetTicket();
          }
        }
      }, 500);
      
      return () => clearInterval(checkInterval);
    }
    
    // Mark this service provider as having a pending request
    pendingTicketRequests.set(id, requestId);
    
    // Function to create or get a ticket
    const createOrGetTicket = async () => {
      console.log('Starting createOrGetTicket function...');
      
      // Use ref to prevent race conditions
      if (isCreatingTicketRef.current) {
        console.log('Ticket creation already in progress (ref), skipping duplicate request');
        return;
      }
      
      // Set the flag to indicate that ticket creation is in progress
      isCreatingTicketRef.current = true;
      try {
        const token = localStorage.getItem('token');
        console.log('Token retrieved from localStorage:', token ? 'Token exists' : 'No token found');
        
        const userStr = localStorage.getItem('user');
        console.log('User string from localStorage:', userStr ? 'User data exists' : 'No user data found');
        
        const user = JSON.parse(userStr || '{}');
        console.log('Parsed user data:', user);
        console.log('User ID:', user._id);
        
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

        // First check if a ticket already exists in the database for this provider and client
        if (!hasCheckedDatabaseRef.current) {
          try {
            console.log('Checking for existing tickets in the database...');
            const checkResponse = await axios.get(
              `${API_URL}/api/v1/tickets/check?client=${user._id}&serviceProvider=${id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            console.log('Check response:', checkResponse.data);
            hasCheckedDatabaseRef.current = true;
            
            if (checkResponse.data.exists) {
              console.log('Existing ticket found in database, using it');
              const existingTicket = checkResponse.data.ticket;
              
              // Store the ticket data in our tracking mechanisms
              createdTickets.set(id, existingTicket);
              
              // Update state with the existing ticket data
              setTicketData(existingTicket);
              setLoading(false);
              
              // Remove this service provider from pending requests
              pendingTicketRequests.delete(id);
              isCreatingTicketRef.current = false;
              return;
            }
          } catch (checkErr) {
            console.error('Error checking for existing tickets:', checkErr);
            // Continue with ticket creation if check fails
          }
        }
        
        // Check localStorage for an existing ticket
        const existingTicketStr = localStorage.getItem(`ticket_${id}`);
        if (existingTicketStr) {
          try {
            console.log('Existing ticket found in localStorage, verifying with backend');
            const parsedTicket = JSON.parse(existingTicketStr);
            
            // Verify the ticket exists in the backend
            const verifyResponse = await axios.get(
              `${API_URL}/api/v1/tickets/${parsedTicket._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (verifyResponse.data.success) {
              console.log('Ticket verified with backend, using existing ticket');
              const verifiedTicket = verifyResponse.data.data;
              
              // Store the ticket data in our tracking mechanisms
              createdTickets.set(id, verifiedTicket);
              
              // Update state with the existing ticket data
              setTicketData(verifiedTicket);
              setLoading(false);
              
              // Remove this service provider from pending requests
              pendingTicketRequests.delete(id);
              isCreatingTicketRef.current = false;
              return;
            }
          } catch (verifyErr) {
            console.log('Ticket verification failed, will create a new one:', verifyErr.message);
            // If verification fails, remove the invalid ticket from localStorage
            localStorage.removeItem(`ticket_${id}`);
          }
        }
        
        console.log('Creating a new ticket...');
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
            createdTickets.set(id, newTicketData);
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
        isCreatingTicketRef.current = false;
        // Remove this service provider from pending requests
        pendingTicketRequests.delete(id);
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
