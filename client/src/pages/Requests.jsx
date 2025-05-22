import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import SideBareClient from "../components/SideBareClient.jsx";
import RequestInfo from "../components/RequestInfo";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTypeFilter, setActiveTypeFilter] = useState("all");
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
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
        
        // Fetch all appointments using the status query parameter with full population
        const appointmentsResponse = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/appointments/client/${clientId}/pending?status=all&populate=true`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (appointmentsResponse.ok) {
          const data = await appointmentsResponse.json();
          console.log('Appointments data:', data);
          setRequests(data.data || []);
        } else {
          const errorText = await appointmentsResponse.text();
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

  // Filter requests by type and status
  const filteredRequests = requests.filter(request => {
    // Filter by appointment type
    const typeMatch = activeTypeFilter === "all" || request.appointmentType.toLowerCase() === activeTypeFilter;
    
    // Filter by status
    const statusMatch = activeStatusFilter === "all" || request.status.toLowerCase() === activeStatusFilter;
    
    // Return true if both filters match
    return typeMatch && statusMatch;
  });

  return (
    <section>
      <Header />
      <SideBareClient />
      <div className="requests-page-container">
        <h1>My Requests</h1>
        
        {/* Combined Filters in one line */}
        <div className="filters-container">
          <div className="filters-row">
            {/* Type filters */}
            <button 
              className={`filter-btn ${activeTypeFilter === "all" ? "active-all" : ""}`}
              onClick={() => setActiveTypeFilter("all")}
            >
              All Types
            </button>
            <button 
              className={`filter-btn ${activeTypeFilter === "radio" ? "active-radio" : ""}`}
              onClick={() => setActiveTypeFilter("radio")}
            >
              Radio
            </button>
            <button 
              className={`filter-btn ${activeTypeFilter === "labo" ? "active-labo" : ""}`}
              onClick={() => setActiveTypeFilter("labo")}
            >
              Labo
            </button>
            <button 
              className={`filter-btn ${activeTypeFilter === "operation" ? "active-operation" : ""}`}
              onClick={() => setActiveTypeFilter("operation")}
            >
              Operation
            </button>
            
            {/* Divider */}
            <div className="filter-divider"></div>
            
            {/* Status filters */}
            <button 
              className={`filter-btn ${activeStatusFilter === "all" ? "active-all" : ""}`}
              onClick={() => setActiveStatusFilter("all")}
            >
              All Statuses
            </button>
            <button 
              className={`filter-btn ${activeStatusFilter === "pending" ? "active-pending" : ""}`}
              onClick={() => setActiveStatusFilter("pending")}
            >
              Pending
            </button>
            <button 
              className={`filter-btn ${activeStatusFilter === "accepted" ? "active-accepted" : ""}`}
              onClick={() => setActiveStatusFilter("accepted")}
            >
              Accepted
            </button>
            <button 
              className={`filter-btn ${activeStatusFilter === "cancelled" ? "active-cancelled" : ""}`}
              onClick={() => setActiveStatusFilter("cancelled")}
            >
              Cancelled
            </button>
          </div>
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
              <p>No {activeTypeFilter !== "all" ? activeTypeFilter : ""} requests 
                 {activeStatusFilter !== "all" ? ` with ${activeStatusFilter} status` : ""} found.</p>
              <p style={{ marginTop: "10px", fontSize: "14px" }}>
                {activeStatusFilter === "all" && activeTypeFilter === "all" ?
                  "When you make a request for radio, labo, or operation services, they will appear here." :
                  "Try changing your filters to see more requests."}
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
