import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import SideBareClient from "../components/SideBareClient.jsx";
import RequestInfo from "../components/RequestInfo";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user || !user._id) {
          throw new Error('No user data found');
        }

        // Get the client ID - ensure we're always using the current client's ID
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
        
        // Fetch pending appointments
        const pendingAppointmentsResponse = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/appointments/client/${clientId}/pending`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (pendingAppointmentsResponse.ok) {
          const pendingData = await pendingAppointmentsResponse.json();
          setRequests(pendingData.data || []);
        } else {
          const errorText = await pendingAppointmentsResponse.text();
          throw new Error(`Failed to fetch requests: ${errorText}`);
        }
      } catch (err) {
        console.error('Requests page error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Filter requests by type
  const filteredRequests = activeFilter === "all" 
    ? requests 
    : requests.filter(request => request.appointmentType.toLowerCase() === activeFilter);

  return (
    <section>
      <Header />
      <SideBareClient />
      <div className="requests-page-container" style={{ marginLeft: "20%", padding: "20px" }}>
        <h1 style={{ color: "#0052E0", marginBottom: "20px" }}>My Requests</h1>
        
        {/* Filter buttons */}
        <div className="request-filters" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
          <button 
            className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
            style={{ 
              padding: "8px 16px", 
              borderRadius: "5px", 
              border: "none", 
              backgroundColor: activeFilter === "all" ? "#0052E0" : "#f0f0f0",
              color: activeFilter === "all" ? "white" : "#333",
              cursor: "pointer"
            }}
          >
            All
          </button>
          <button 
            className={`filter-btn ${activeFilter === "radio" ? "active" : ""}`}
            onClick={() => setActiveFilter("radio")}
            style={{ 
              padding: "8px 16px", 
              borderRadius: "5px", 
              border: "none", 
              backgroundColor: activeFilter === "radio" ? "#0052E0" : "#f0f0f0",
              color: activeFilter === "radio" ? "white" : "#333",
              cursor: "pointer"
            }}
          >
            Radio
          </button>
          <button 
            className={`filter-btn ${activeFilter === "labo" ? "active" : ""}`}
            onClick={() => setActiveFilter("labo")}
            style={{ 
              padding: "8px 16px", 
              borderRadius: "5px", 
              border: "none", 
              backgroundColor: activeFilter === "labo" ? "#0052E0" : "#f0f0f0",
              color: activeFilter === "labo" ? "white" : "#333",
              cursor: "pointer"
            }}
          >
            Labo
          </button>
          <button 
            className={`filter-btn ${activeFilter === "operation" ? "active" : ""}`}
            onClick={() => setActiveFilter("operation")}
            style={{ 
              padding: "8px 16px", 
              borderRadius: "5px", 
              border: "none", 
              backgroundColor: activeFilter === "operation" ? "#0052E0" : "#f0f0f0",
              color: activeFilter === "operation" ? "white" : "#333",
              cursor: "pointer"
            }}
          >
            Operation
          </button>
        </div>
        
        {/* Requests list */}
        <div className="requests-list" style={{ 
          backgroundColor: "white", 
          borderRadius: "10px", 
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          minHeight: "300px"
        }}>
          {loading ? (
            <div className="loading-spinner" style={{ textAlign: "center", padding: "40px" }}>
              <div className="spinner" style={{ 
                width: "40px", 
                height: "40px", 
                border: "4px solid rgba(0, 82, 224, 0.1)", 
                borderRadius: "50%", 
                borderTop: "4px solid #0052E0", 
                animation: "spin 1s linear infinite", 
                margin: "0 auto" 
              }}></div>
              <p style={{ marginTop: "10px", color: "#666" }}>Loading your requests...</p>
            </div>
          ) : error ? (
            <div className="error-message" style={{ textAlign: "center", padding: "40px", color: "#dc3545" }}>
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
          ) : filteredRequests.length === 0 ? (
            <div className="no-requests" style={{ textAlign: "center", padding: "40px", color: "#666" }}>
              <p>No {activeFilter !== "all" ? activeFilter : ""} requests found.</p>
              <p style={{ marginTop: "10px", fontSize: "14px" }}>
                When you make a request for radio, labo, or operation services, they will appear here.
              </p>
            </div>
          ) : (
            <div className="requests-grid" style={{ display: "grid", gap: "15px" }}>
              {filteredRequests.map((request) => (
                <RequestInfo key={request._id} appointment={request} />
              ))}
            </div>
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

export default Requests;
