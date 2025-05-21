import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../component/Button.jsx';
import { Card, CardContent } from '../component/Card.jsx';
import { toast, ToastContainer } from 'react-toastify';
import './component.css';

const TicketComp = () => {
  const [ticketStats, setTicketStats] = useState({
    dailyTickets: 0,
    waitingList: 0,
    passedTickets: 0,
    paused: false,
  });

  const worker = JSON.parse(localStorage.getItem('loggedWorker'));
  const serviceProvider = JSON.parse(localStorage.getItem('loggedServiceProvider'));

  const fetchTicketStats = async () => {
    try {
      const response = await axios.get(`/api/tickets/stats/${worker._id}`);
      const data = response.data.data;
      setTicketStats({
        dailyTickets: data.dailyTickets,
        waitingList: data.waitingList,
        passedTickets: data.passedTickets,
        paused: data.ticketDemandPaused || false,
      });
    } catch (err) {
      console.error('Error fetching ticket stats:', err);
      toast.error('Failed to fetch ticket stats');
    }
  };

  const handlePause = async () => {
    try {
      await axios.post(`/api/tickets/pause/${worker._id}`);
      toast.success('Ticket demand paused');
      fetchTicketStats();
    } catch (err) {
      console.error('Error pausing ticket demand:', err);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset the ticket list for today?')) return;
    try {
      await axios.post(`/api/tickets/reset/${worker._id}`);
      toast.success('Day reset successfully');
      fetchTicketStats();
    } catch (err) {
      console.error('Error resetting day:', err);
    }
  };

  const handleIncrement = async () => {
    try {
      await axios.post(`/api/tickets/next/${worker._id}`);
      toast.success('Ticket incremented');
      fetchTicketStats();
    } catch (err) {
      console.error('Error incrementing ticket:', err);
    }
  };

  useEffect(() => {
    if (worker && serviceProvider) fetchTicketStats();
  }, []);

  return (
    <div className="p-6 flex flex-col items-center gap-4 w-full">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Passed Tickets */}
      <Card className="bg-white shadow-md p-4 w-full max-w-md">
        <CardContent className="text-center">
          <h2 className="text-md font-semibold mb-1">Passed Tickets</h2>
          <p className="text-2xl font-bold text-green-600 justify-center  text-center" >{ticketStats.passedTickets}</p>
        </CardContent>
      </Card>

      {/* Increment */}
      <Button
        onClick={handleIncrement}
        className={`w-full max-w-md bg-green-500 hover:bg-green-600 ${ticketStats.paused ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={ticketStats.paused}
      >
        Increment
      </Button>

      {/* Waiting List */}
      <Card className="bg-white shadow-md p-4 w-full max-w-md">
        <CardContent className="text-center">
          <h2 className="text-md font-semibold mb-1">Waiting List</h2>
          <p className="text-2xl font-bold text-yellow-600 justify-center  text-center">{ticketStats.waitingList}</p>
        </CardContent>
      </Card>

      {/* Pause */}
      <Button
        onClick={handlePause}
        className="w-full max-w-md bg-yellow-500 hover:bg-yellow-600"
      >
        Pause
      </Button>

      {/* Daily Tickets */}
      <Card className="bg-white shadow-md  p-4 w-full max-w-md">
        <CardContent className="text-center">
          <h2 className="text-md font-semibold mb-1">Daily Tickets</h2>
          <p className="text-2xl font-bold text-blue-600  justify-center  text-center">{ticketStats.dailyTickets}</p>
        </CardContent>
      </Card>

      {/* Reset */}
      <Button
        onClick={handleReset}
        className="w-full max-w-md bg-red-500 hover:bg-red-600"
      >
        Reset
      </Button>
    </div>
  );
};

export default TicketComp;
