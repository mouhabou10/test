import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LaboTicket = () => {
  const [appointmentData, setAppointmentData] = useState(null);
  const [userName, setUserName] = useState("Patient");
  const [ticket, setTicket] = useState(false);

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
    const appointmentStr = localStorage.getItem('laboAppointment');
    if (appointmentStr) {
      try {
        const appointment = JSON.parse(appointmentStr);
        setAppointmentData(appointment);
      } catch (e) {
        console.error('Error parsing appointment data:', e);
      }
    }
  }, []);

  return (
    <section
      style={{ marginLeft: "20%", marginRight: "5%", marginBottom: "5%" }}
    >
      {ticket ? (
        <div className="allowed">
          <h1 style={{ color: "#0052E0" }}>Lab Test Ticket</h1>
          <div className="book-div">
            <p>
              Your request has been accepted! You can now book a ticket for today if you are ready.
            </p>
            <Link to={"/labo/labo-ticket/:123/online-ticket"}>Book Now</Link>
          </div>
          <div className="note">
            <h3 style={{ color: "#0052E0" }}>Note:</h3>
            <p style={{ margin: "auto" }}>
              This booking is valid for only <span>5</span> days. It started on{" "}
              <span>{new Date().toLocaleDateString()}</span>.
            </p>
          </div>
        </div>
      ) : (
        <div className="not-allowed" style={{ textAlign: "center", padding: "40px 20px", backgroundColor: "#f8f9fa", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
          <div className="success-icon" style={{ margin: "0 auto 20px", width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#4CAF50", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <span style={{ color: "white", fontSize: "40px", fontWeight: "bold" }}>✓</span>
          </div>
          <h2 style={{ color: "#0052E0", marginBottom: "20px" }}>Request Successfully Submitted!</h2>
          <h3 style={{ color: "#0052E0", marginBottom: "15px" }}>Hello {userName}</h3>
          <p style={{ margin: "auto", fontSize: "18px", lineHeight: "1.6", maxWidth: "600px" }}>
            Your lab prescription has been successfully uploaded. Our team will review your prescription as soon as possible.
          </p>
          <p style={{ margin: "20px auto", fontSize: "18px", lineHeight: "1.6", maxWidth: "600px" }}>
            <strong>You will receive a notification</strong> when your request has been processed.
          </p>
          <div style={{ marginTop: "30px" }}>
            <Link to="/" style={{ display: "inline-block", padding: "10px 20px", backgroundColor: "#0052E0", color: "white", textDecoration: "none", borderRadius: "5px", fontWeight: "bold" }}>Return to Dashboard</Link>
          </div>
        </div>
      )}
    </section>
  );
}

export default LaboTicket