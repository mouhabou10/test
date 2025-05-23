import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TicketComp = () => {
  const [waitingList, setWaitingList] = useState(0);
  const [passedList, setPassedList] = useState(0);

  const userId = localStorage.getItem('userId');
  const speciality = localStorage.getItem('speciality');

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/v1/tickets/stats');
      const stat = res.data.data.find((s) => s.speciality === speciality);
      if (stat) {
        setWaitingList(stat.waitingList);
        setPassedList(stat.passedTickets);
        
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const increment = async () => {
    try {
      await axios.put(`http://localhost:3000/api/tickets/increment/${userId}`);
      fetchStats();
    } catch (err) {
      console.error('Error incrementing passed list:', err);
    }
  };

  const pause = async () => {
    try {
      await axios.put(`http://localhost:3000/api/tickets/pause/${userId}`);
      alert('Ticket demand paused.');
      fetchStats();
    } catch (err) {
      console.error('Error pausing demand:', err);
    }
  };

  const reset = async () => {
    const confirmed = window.confirm('Are you sure you want to reset today’s tickets?');
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3000/api/tickets/reset/${userId}`);
      fetchStats();
    } catch (err) {
      console.error('Error resetting day:', err);
    }
  };

  useEffect(() => {
    if (speciality) {
      fetchStats();
    }
  }, [speciality]);

  if (!userId || !speciality) return <p>Loading user info...</p>;

  return (
    <div style={{ padding: '1rem', boxShadow: '0 0 10px rgba(0,0,0,0.15)', borderRadius: '8px', maxWidth: '400px' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
        {speciality} Tickets
      </h2>

      <p>Waiting: {waitingList}</p>
      <p>Passed: {passedList}</p>
      <p>Total Today: {waitingList + passedList}</p>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button onClick={increment} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Next
        </button>
        <button onClick={pause} style={{ padding: '0.5rem 1rem', cursor: 'pointer', border: '1px solid gray', background: 'white' }}>
          Pause
        </button>
        <button
          onClick={reset}
          style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: 'red', color: 'white', border: 'none' }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default TicketComp;
