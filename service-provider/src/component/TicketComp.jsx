import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../component/Button.jsx';
import { Card, CardContent } from '../component/Card.jsx';
import { toast, ToastContainer } from 'react-toastify';
import './component.css'
const TicketComp = () => {
  const [ticketStats, setTicketStats] = useState({
    dailyTickets: 0,
    waitingList: 0,
    passedTickets: 0,
  });

  const fetchTicketStats = async () => {
    try {
      const response = await axios.get('/api/tickets/stats');
      setTicketStats(response.data);
    } catch (err) {
      console.error('Error fetching ticket stats:', err);
    }
  };

  const handlePause = async () => {
    try {
      await axios.post('/api/tickets/pause/123');
      toast.success('Ticket demand paused');
      fetchTicketStats();
    } catch (err) {
      console.error('Error pausing ticket demand:', err);
    }
  };

  const handleReset = async () => {
    try {
      await axios.post('/api/tickets/reset/123');
      toast.success('Day reset successfully');
      fetchTicketStats();
    } catch (err) {
      console.error('Error resetting day:', err);
    }
  };

  const handleIncrement = async () => {
    try {
      await axios.post('/api/tickets/next/123');
      toast.success('Ticket incremented');
      fetchTicketStats();
    } catch (err) {
      console.error('Error incrementing ticket:', err);
    }
  };

  useEffect(() => {
    fetchTicketStats();
  }, []);

  return (
    <div className="p-4 flex flex-col gap-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <Card className="bg-white shadow-lg p-4">
        <CardContent>
          <h2 className="text-xl font-bold">Passed Tickets</h2>
          <p className="text-2xl">{ticketStats.passedTickets}</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg p-4">
        <CardContent>
          <h2 className="text-xl font-bold">Waiting List</h2>
          <p className="text-2xl">{ticketStats.waitingList}</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg p-4">
        <CardContent>
          <h2 className="text-xl font-bold">Daily Tickets</h2>
          <p className="text-2xl">{ticketStats.dailyTickets}</p>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-center mt-4">
        <Button onClick={handlePause} className="bg-yellow-500">Pause</Button>
        <Button onClick={handleReset} className="bg-red-500">Reset</Button>
        <Button onClick={handleIncrement} className="bg-green-500">Increment</Button>
      </div>
    </div>
  );
};

export default TicketComp;
