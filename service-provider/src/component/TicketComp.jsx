import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Button } from '../component/Button.jsx';
import { Card, CardContent } from '../component/Card.jsx';
import { toast, ToastContainer } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';
import './component.css';

const TicketComp = () => {
  const [ticketStats, setTicketStats] = useState({
    dailyTickets: 0,
    waitingList: 0,
    passedTickets: 0,
    paused: false,
  });

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.speciality && user?.serviceProvider) {
      fetchTicketStats(user.speciality, user.serviceProvider);
    }
  }, [user]);

  const fetchTicketStats = async (speciality, serviceProviderId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/tickets/stats`);
      console.log('API Response:', response.data);

      const stats = response.data?.data?.find(
        (stat) =>
          stat.speciality?.trim().toLowerCase() === speciality.trim().toLowerCase() &&
          stat.serviceProvider === serviceProviderId
      );

      if (stats) {
        setTicketStats({
          dailyTickets: stats.dailyTickets || 0,
          waitingList: stats.waitingList || 0,
          passedTickets: stats.passedTickets || 0,
          paused: stats.paused || false,
        });
      } else {
        toast.error('No stats found for your speciality and service provider');
      }
    } catch (err) {
      console.error('Error fetching ticket stats:', err);
      toast.error('Failed to fetch ticket stats');
    }
  };

  const handleResetDay = async () => {
    try {
      await axios.post(`/api/tickets/reset/${user.userId}`);
      setTicketStats({
        dailyTickets: 0,
        waitingList: 0,
        passedTickets: 0,
        paused: false,
      });
      toast.success('Day reset successfully');
    } catch (err) {
      console.error('Error resetting day:', err);
      toast.error('Failed to reset day');
    }
  };

  const handleIncrementPassed = async () => {
    try {
      await axios.post(`/api/tickets/next/${user.userId}`);
      setTicketStats((prev) => ({
        ...prev,
        passedTickets: prev.passedTickets + 1,
        waitingList: prev.waitingList - 1,
      }));
      toast.success('Incremented passed tickets');
    } catch (err) {
      console.error('Error incrementing passed tickets:', err);
      toast.error('Failed to increment passed tickets');
    }
  };

  return (
    <div className="ticket-comp">
      <ToastContainer />
      <Card>
        <CardContent>
          <h2>Ticket Stats for {user?.speciality || 'Unknown Speciality'}</h2>
          <p>Daily Tickets: {ticketStats.dailyTickets}</p>
          <p>Waiting List: {ticketStats.waitingList}</p>
          <p>Passed Tickets: {ticketStats.passedTickets}</p>
          <p>Status: {ticketStats.paused ? 'Paused' : 'Active'}</p>
          <div className="buttons">
            <Button onClick={handleResetDay}>Reset Day</Button>
            <Button onClick={handleIncrementPassed} disabled={ticketStats.waitingList === 0}>
              Increment Passed Tickets
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketComp;
