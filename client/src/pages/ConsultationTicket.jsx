import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ConsultationTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const createOrGetTicket = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const existingTicket = localStorage.getItem(`ticket_${id}`);

        if (!token || !user?._id) {
          setError('Please log in to create a ticket.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setTimeout(() => {
            navigate('/login', { state: { from: `/consultation/ticket/${id}` } });
          }, 2000);
          return;
        }

        if (existingTicket) {
          // Use existing ticket if found
          setTicketData(JSON.parse(existingTicket));
          setLoading(false);
          return;
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/tickets/create`,
          {
            serviceProvider: id,
            client: user._id
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          const newTicketData = response.data.data;
          setTicketData(newTicketData);
          // Store the ticket in localStorage
          localStorage.setItem(`ticket_${id}`, JSON.stringify(newTicketData));
          setError(null);
        } else {
          throw new Error(response.data.message || 'Failed to create ticket');
        }
      } catch (err) {
        console.error('Error creating ticket:', err);
        
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setError('Your session has expired. Please log in again.');
          setTimeout(() => {
            navigate('/login', { state: { from: `/consultation/ticket/${id}` } });
          }, 2000);
        } else if (err.response?.status === 404) {
          setError('Provider or user not found. Please try again.');
        } else if (err.response?.status === 500) {
          setError('A server error occurred. Please try again later.');
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to create ticket');
        }
      } finally {
        setLoading(false);
      }
    };

    createOrGetTicket();
  }, [id, navigate]);

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
          <p><strong>Spécialité:</strong> {ticketData.serviceProvider?.speciality}</p>
        </div>
        <div className="detail-row">
          <p><strong>Date de création:</strong> {new Date(ticketData.createdAt).toLocaleString('fr-DZ')}</p>
        </div>
        <div className="detail-row">
          <p><strong>Status:</strong> {ticketData.status}</p>
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
