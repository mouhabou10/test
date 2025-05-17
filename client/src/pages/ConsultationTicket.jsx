import React from "react";

const ConsultationTicket = () => {
  // Sample data - replace with actual data from your backend
  const ticketData = {
    ticketNumber: "23",
    waitingList: "12",
    fullName: "Mohamed Amine",
    specialty: "Cardiologie",
    createDate: new Date().toLocaleString('fr-DZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    estimatedTime: "10:30",
    hospitalName: "CHU Mustapha Pacha",
    departmentName: "Service de Cardiologie",
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('fr-DZ') // 24 hours from now
  };

  return (
    <section style={{ marginLeft: "20%", marginRight: "5%", marginBottom: "5%" }}>
      <div className="ticket-container">
        <h1 style={{ color: "#0052E0" }}>Ticket de Consultation</h1>
        <div className="consultation-ticket">
          <div className="ticket-header">
            <div className="ticket-header-text">
              <p className="header-title">REPUBLIQUE ALGERIENNE DEMOCRATIQUE ET POPULAIRE</p>
              <p className="header-subtitle">Ministère de la Santé</p>
              <p className="hospital-name">{ticketData.hospitalName}</p>
            </div>
          </div>

          <div className="ticket-body">
            <div className="ticket-number-section">
              <div className="number-circle">
                <span className="number">{ticketData.ticketNumber}</span>
              </div>
              <div className="waiting-info">
                <p>Personnes en attente: <span className="highlight">{ticketData.waitingList}</span></p>
                <p>Heure estimée: <span className="highlight">{ticketData.estimatedTime}</span></p>
              </div>
            </div>

            <div className="ticket-details">
              <div className="detail-row">
                <p><strong>Nom et Prénom:</strong> {ticketData.fullName}</p>
                <p><strong>Spécialité:</strong> {ticketData.specialty}</p>
              </div>
              <div className="detail-row">
                <p><strong>Service:</strong> {ticketData.departmentName}</p>
                <p><strong>Date de création:</strong> {ticketData.createDate}</p>
              </div>
              <div className="validity-info">
                <p><strong>Valable jusqu'au:</strong> {ticketData.validUntil}</p>
              </div>
            </div>

            <div className="ticket-footer">
              <p className="important-note">Important:</p>
              <ul className="instructions">
                <li>Veuillez vous présenter 15 minutes avant l'heure estimée</li>
                <li>Ce ticket est personnel et non transférable</li>
                <li>En cas de retard, un nouveau ticket peut être nécessaire</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationTicket;
