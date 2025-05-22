import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const OnlineTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Default values
  const date = new Date();
  const formattedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

  useEffect(() => {
    // Load ticket data from localStorage
    const ticketStr = localStorage.getItem('currentTicket');
    if (ticketStr) {
      try {
        const ticket = JSON.parse(ticketStr);
        setTicketData(ticket);
      } catch (err) {
        console.error('Error parsing ticket data:', err);
        setError('Error loading ticket data');
      }
    } else {
      setError('No ticket data found');
    }
    setLoading(false);
  }, []);


  // If loading, show loading message
  if (loading) {
    return (
      <section style={{ marginLeft: "20%", marginRight: "5%", marginBottom: "5%" }}>
        <div className="consultation-ticket loading">
          <div className="loading-spinner"></div>
          <p>Creating your ticket...</p>
        </div>
      </section>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <section style={{ marginLeft: "20%", marginRight: "5%", marginBottom: "5%" }}>
        <div className="consultation-ticket error">
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
            <button 
              onClick={() => navigate(-1)}
              className="login-button"
            >
              Go Back
            </button>
          </div>
        </div>
      </section>
    );
  }

  // If no ticket data, show message
  if (!ticketData) {
    return (
      <section style={{ marginLeft: "20%", marginRight: "5%", marginBottom: "5%" }}>
        <div className="consultation-ticket">
          <div className="error-message">
            <h3>No Ticket Found</h3>
            <p>No ticket information is available</p>
            <button 
              onClick={() => navigate(-1)}
              className="login-button"
            >
              Go Back
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Get user name from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const username = user.fullName || "Patient";
  
  // Get service type based on appointment type
  const serviceType = ticketData.appointmentType === 'radio' ? 'Radiology' : 
                     ticketData.appointmentType === 'labo' ? 'Laboratory' : 'Medical Service';
  
  // Get ticket number and waiting count
  const ticketNumber = ticketData.number || 1;
  const waitingList = ticketData.waitingCount || 0;

  // Calculate estimated waiting time (15 minutes per person)
  const estimatedWaitingTime = waitingList * 15;
  
  return (
    <section style={{ marginLeft: "20%", marginRight: "5%", marginBottom: "5%" }}>
      <div className="consultation-ticket">
        <div className="ticket-header-text">
          <div className="header-title">RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE</div>
          <div className="header-subtitle">Ministère de la Santé</div>
          <div className="hospital-name">{ticketData.serviceProvider?.name || 'Hôpital Central'}</div>
        </div>

        <div className="ticket-number-section">
          <div className="waiting-info">
            People Waiting: <span className="highlight">{waitingList}</span>
          </div>
          <div className="number-circle">
            <div className="number">{ticketNumber}</div>
          </div>
          <div className="waiting-info">
            Estimated Time: <span className="highlight">{Math.floor(estimatedWaitingTime / 60)}h {estimatedWaitingTime % 60}min</span>
          </div>
        </div>

        <div className="ticket-details">
          <div className="detail-row">
            <p><strong>Nom et Prénom:</strong> {username}</p>
          </div>
          <div className="detail-row">
            <p><strong>Spécialité:</strong> {serviceType}</p>
          </div>
          <div className="detail-row">
            <p><strong>Date de création:</strong> {new Date().toLocaleString('fr-DZ')}</p>
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
    </section>
  );
};

export default OnlineTicket;
