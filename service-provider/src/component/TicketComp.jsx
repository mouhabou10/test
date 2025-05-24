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
    total: 0,
    currentNumber: 0
  });

  const navigate = useNavigate();
  const { user } = useAuth();
  const ticketType = getTicketType(user?.role);

  const fetchStats = async () => {
    console.log('Starting fetchStats...');
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/tickets/stats`,
        {
          params: {
            serviceProvider: user?.serviceProviderId,
            ticketType,
            speciality: user?.speciality
          },
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        }
      );

      console.log('Raw API response:', response.data);

      if (response.data.success && Array.isArray(response.data.data)) {
        const currentStats = response.data.data.find(stat => 
          stat.serviceProvider === user?.serviceProviderId && 
          stat.ticketType === ticketType &&
          stat.speciality === user?.speciality
        );

        console.log('Found current stats:', currentStats);

        if (currentStats) {
          setStats({
            waiting: currentStats.waitingList || 0,
            passed: currentStats.passedList || 0,
            total: currentStats.dailyTickets || 0,
            currentNumber: currentStats.currentNumber || 0
          });
        }
      }
      setLoading(false);
    } catch (err) {
      console.error('Stats error:', err);
      setError('Failed to fetch stats');
      setLoading(false);
    }
  };

 // service-provider/src/component/TicketComp.jsx
// service-provider/src/component/TicketComp.jsx

const handleNext = async () => {
  try {
    console.log('Processing next ticket...');
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/tickets/next`,  // Remove duplicate api/v1
      {
        serviceProvider: user?.serviceProviderId,
        ticketType,
        speciality: user?.speciality
      },
      {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      }
    );

    console.log('Next ticket response:', response.data);
    if (response.data.success) {
      await fetchStats();
      setError(null);
    }
  } catch (err) {
    console.error('Next ticket error:', err);
    setError('Failed to process next ticket');
  }
};

const handleReset = async () => {
  try {
    console.log('Resetting tickets...');
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/tickets/reset`,  // Remove duplicate api/v1
      {
        serviceProvider: user?.serviceProviderId,
        ticketType,
        speciality: user?.speciality
      },
      {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      }
    );

    console.log('Reset response:', response.data);
    if (response.data.success) {
      await fetchStats();
      setError(null);
    }
  } catch (err) {
    console.error('Reset error:', err);
    setError('Failed to reset tickets');
  }
};

const handlePauseResume = async () => {
  try {
    const action = isPaused ? 'resume' : 'pause';
    console.log(`${action}ing tickets...`);
    
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/tickets/${action}`,  // Remove duplicate api/v1
      {
        serviceProvider: user?.serviceProviderId,
        ticketType,
        speciality: user?.speciality
      },
      {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      }
    );

    console.log(`${action} response:`, response.data);
    if (response.data.success) {
      setIsPaused(!isPaused);
      await fetchStats();
      setError(null);
    }
  } catch (err) {
    console.error(`${isPaused ? 'Resume' : 'Pause'} error:`, err);
    setError(`Failed to ${isPaused ? 'resume' : 'pause'} ticket system`);
  }
};

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!user?.token) {
        navigate('/login');
        return;
      }
      if (ticketType && mounted) {
        await fetchStats();
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [user, ticketType]);

  if (loading) return <div className="loading">Loading tickets...</div>;
  if (!ticketType) return <div className="error-message">Invalid user role</div>;

  return (
    <div className="ticket-management">
      <h2>{ticketType.charAt(0).toUpperCase() + ticketType.slice(1)} Tickets</h2>
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchStats} className="retry-btn">Retry</button>
        </div>
      )}
      
      <div className="ticket-stats">
        <div className="stat-item current">
          <span>Current Number</span>
          <strong className="current-number">{stats.currentNumber}</strong>
        </div>
        <div className="stat-item">
          <span>Waiting</span>
          <strong>{stats.waiting}</strong>
        </div>
        <div className="stat-item">
          <span>Passed</span>
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
          disabled={!ticketType || stats.total === 0}
        >
          Reset All Tickets
        </button>
        
        <button 
          onClick={handlePauseResume}
          className={`action-btn ${isPaused ? 'resume' : 'pause'}`}
          disabled={!ticketType}
        >
          {isPaused ? 'Resume Tickets' : 'Pause New Tickets'}
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