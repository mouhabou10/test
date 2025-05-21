import React, { useState, useEffect } from "react";
import { IoMdPerson } from "react-icons/io";
import InfoRow from "../components/InfoRow";
import Card1 from "../images/healthcare.png";
import Card2 from "../images/mri.png";
import Card3 from "../images/chemistry.png";
import Card4 from "../images/patient.png";
import AppointmentCards from "../components/AppointmentCards";
import RequestInfo from "../components/RequestInfo"; 

import { Link } from "react-router-dom";

const Dashboard = () => {
  const [userData, setUserData] = useState({
    fullName: '',
    gender: '',
    age: '',
    phoneNumber: '',
    email: '',
    userId: ''
  });
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    pastAppointments: 0,
    consultations: 0,
    radioTests: 0,
    laboTests: 0,
    operations: 0
  });
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user || !user._id) {
          throw new Error('No user data found');
        }

        // Fetch user data
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/users/${user._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        setUserData(data.data);
        
        // Fetch appointments stats
        const statsResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/clients/${user._id}/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.data);
        }
        
        // Fetch pending appointments
        // Get the client ID - ensure we're always using the current client's ID
        // First check user.client, then _id, then fallback to user ID if available
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
        
        try {
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
            
            // Process the pending appointments data
            
            setPendingAppointments(pendingData.data || []);
          } else {
            // Handle error silently
            const errorText = await pendingAppointmentsResponse.text();
          }
        } catch (fetchError) {
          // Silent error handling for pending appointments
        }
        
      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <section>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <div className="first-cards">
            <div className="info">
              <div className="info-leftSide">
                <IoMdPerson size={70} />
                <h2 style={{ color: "#0052E0" }}>{userData.fullName}</h2>
                <p style={{ color: "#808080" }}>Appointment</p>
                <div className="appoint-info">
                  <div className="appoint-text">
                    {stats.upcomingAppointments} <br /> upcoming
                  </div>
                  <div className="line"></div>
                  <div className="appoint-text">
                    {stats.pastAppointments} <br /> past
                  </div>
                </div>
              </div>
              <div className="line"></div>
              <div className="info-rightSide">
                <div className="info-row">
                  <div>
                    <p>Gender : {userData.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : 'Not specified'}</p>
                    <hr style={{ border: "0.1px solid rgba(0, 94, 255, 0.19)", marginTop: "2px" }} />
                  </div>
                  <div>
                    <p>Age : {userData.age || 'Not specified'}</p>
                    <hr style={{ border: "0.1px solid rgba(0, 94, 255, 0.19)", marginTop: "2px" }} />
                  </div>
                </div>
                <div className="info-row">
                  <div>
                    <p>Phone : {userData.phoneNumber}</p>
                    <hr style={{ border: "0.1px solid rgba(0, 94, 255, 0.19)", marginTop: "2px" }} />
                  </div>
                  <div>
                    <p>User ID : {userData.userId}</p>
                    <hr style={{ border: "0.1px solid rgba(0, 94, 255, 0.19)", marginTop: "2px" }} />
                  </div>
                </div>
                <div className="info-row">
                  <div>
                    <p>Email : {userData.email}</p>
                    <hr style={{ border: "0.1px solid rgba(0, 94, 255, 0.19)", marginTop: "2px" }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="medical">
              <h3>Appointments</h3>
              <InfoRow />
              <InfoRow />
              <InfoRow />
              <InfoRow />
            </div>
          </div>
          <div className="analyse-container">
            <div className="analyse-title">
              <h1>Analyse</h1>
              <select>
                <option value="today">Today</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
            <div className="analyse-cards">
              <div className="analyse-card">
                <img src={Card1} alt="error" />
                <b>{stats.consultations}</b>
                <p>consultation</p>
              </div>
              <div className="analyse-card">
                <img src={Card2} alt="error" />
                <b>{stats.radioTests}</b>
                <p>Radio</p>
              </div>
              <div className="analyse-card">
                <img src={Card3} alt="error" />
                <b>{stats.laboTests}</b>
                <p>Labo</p>
              </div>
              <div className="analyse-card">
                <img src={Card4} alt="error" />
                <b>{stats.operations}</b>
                <p>Operation</p>
              </div>
            </div>
          </div>
          <div className="thourd-row">
            <div className="appintment">
              <h1>My appintment</h1>
              <div className="appintment-container">
                <div className="appointment-content">
                  <div className="line" style={{ width: "4px" }}></div>
                  <div className="appointment-cards">
                    <AppointmentCards />
                    <AppointmentCards />
                    <AppointmentCards />
                    <AppointmentCards />
                    <AppointmentCards />
                  </div>
                </div>
                <div>
                  <Link to={'consultation'}>Add appointment</Link>
                </div>
              </div>
            </div>
            
            <div className="Requests-container">
              <h1>Requests Status</h1>
              <div className="Requests-content">
                {pendingAppointments.length === 0 ? (
                  <div className="no-requests-message">
                    <p>No pending requests found</p>
                  </div>
                ) : (
                  pendingAppointments.map((appointment) => (
                    <RequestInfo key={appointment._id} appointment={appointment} />
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Dashboard;
