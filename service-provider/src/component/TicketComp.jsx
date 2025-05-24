// service-provider/src/component/TicketComp.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TicketComp.css';
import useAuth from '../hooks/useAuth.js';

const getTicketType = (role) => {
  if (!role) return null;
  const userRole = role.toLowerCase().trim();
  
  switch (userRole) {
    case 'consultation agent':
      return 'consultation';
    case 'radioagent':
      return 'radio';
    case 'laboagent':
      return 'labo';
    default:
      console.log('Invalid role:', userRole);
      return null;
  }
};

const TicketComp = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    waiting: 0,
    passed: 0,
    total: 0
  });

  const navigate = useNavigate();
  const { user } = useAuth();
  const ticketType = getTicketType(user?.role);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/tickets/stats`, 
        {
          params: {
            serviceProvider: user?.serviceProviderId,
            ticketType: ticketType,
            speciality: user?.speciality
          },
          headers: { 
            'Authorization': `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch stats');
      console.error('Stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/tickets/reset`,
        {
          serviceProvider: user?.serviceProviderId,
          ticketType: ticketType,
          speciality: user?.speciality
        },
        {
          headers: { 
            'Authorization': `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      await fetchStats();
      setError(null);
    } catch (err) {
      setError('Failed to reset tickets');
      console.error('Reset error:', err);
    }
  };

  const handlePauseResume = async () => {
    try {
      const endpoint = isPaused ? 'resume' : 'pause';
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/tickets/${endpoint}`,
        {
          serviceProvider: user?.serviceProviderId,
          ticketType: ticketType,
          speciality: user?.speciality
        },
        {
          headers: { 
            'Authorization': `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setIsPaused(!isPaused);
      setError(null);
    } catch (err) {
      setError(`Failed to ${isPaused ? 'resume' : 'pause'} ticket system`);
      console.error('Pause/Resume error:', err);
    }
  };

  const handleNext = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/tickets/next`,
        {
          serviceProvider: user?.serviceProviderId,
          ticketType: ticketType,
          speciality: user?.speciality
        },
        {
          headers: { 
            'Authorization': `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      await fetchStats();
      setError(null);
    } catch (err) {
      setError('Failed to process next ticket');
      console.error('Next error:', err);
    }
  };

  useEffect(() => {
    if (!user?.token) {
      navigate('/login');
      return;
    }
    if (ticketType) {
      fetchStats();
    }
  }, [user, ticketType]);

  if (loading) return <div className="loading">Loading tickets...</div>;
  if (!ticketType) return <div className="error-message">Invalid user role</div>;

  return (
    <div className="ticket-management">
      <h2>{ticketType.charAt(0).toUpperCase() + ticketType.slice(1)} Tickets</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="ticket-stats">
        <div className="stat-item">
          <span>Waiting</span>
          <strong>{stats.waiting}</strong>
        </div>
        <div className="stat-item">
          <span>Processed</span>
          <strong>{stats.passed}</strong>
        </div>
        <div className="stat-item">
          <span>Total Today</span>
          <strong>{stats.total}</strong>
        </div>
      </div>

      <div className="ticket-actions">
        <button 
          onClick={handleReset}
          className="action-btn reset"
          disabled={!ticketType}
        >
          Reset Day
        </button>
        
        <button 
          onClick={handlePauseResume}
          className={`action-btn ${isPaused ? 'resume' : 'pause'}`}
          disabled={!ticketType}
        >
          {isPaused ? 'Resume Tickets' : 'Pause Tickets'}
        </button>
        
        <button 
          onClick={handleNext}
          className="action-btn next"
          disabled={!ticketType || stats.waiting === 0}
        >
          Next Patient
        </button>
      </div>
    </div>
  );
};

export default TicketComp;