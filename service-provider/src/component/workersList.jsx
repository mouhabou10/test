// service-provider/src/component/workersList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter, Plus } from 'lucide-react';
import "./list.css";
import WorkerTable from './workerTable.jsx';
import AddWorkerModal from './AddWorkerModal.jsx';
import useAuth from '../hooks/useAuth.js';

const WorkersList = () => {
  const [workers, setWorkers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get user from auth context

  const fetchWorkers = async () => {
    try {
      if (!user?.serviceProviderId) {
        throw new Error('Service Provider ID not found');
      }

      const res = await axios.get(`http://localhost:3000/api/v1/workers`, {
        params: { serviceProvider: user.serviceProviderId },
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      setWorkers(res.data.data);
    } catch (err) {
      console.error('Failed to fetch workers:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (user?.serviceProviderId) {
      fetchWorkers();
    }
  }, [user]); // Re-fetch when user changes

  const handleAddWorker = async (formData) => {
    try {
      if (!user?.serviceProviderId) {
        throw new Error('Service Provider ID not found');
      }

      await axios.post('http://localhost:3000/api/v1/workers', {
        ...formData,
        serviceProvider: user.serviceProviderId
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      setIsModalOpen(false);
      fetchWorkers();
    } catch (err) {
      console.error('Failed to add worker:', err);
      setError(err.message);
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={() => fetchWorkers()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='carder'>
      <form onSubmit={(e) => e.preventDefault()}>
        <input 
          type="text" 
          className='names' 
          placeholder="Search worker" 
        />
        <select name="title" id="title">
          <option value="">All Roles</option>
          <option value="consultation-agent">Consultation Agent</option>
          <option value="labo-agent">Labo Agent</option>
          <option value="radio-agent">Radio Agent</option>
          <option value="department-chef">Department Chef</option>
        </select>
        
        <input type="date" className="date-picker" />
        
        <button type='button' className='filter-button'>
          <Filter /> Filter
        </button>

        <button
          type="button"
          className='add-worker-btn'
          onClick={() => setIsModalOpen(true)}
        >
          <Plus /> Add Worker
        </button>
      </form>

      <WorkerTable 
        data={workers} 
        onRefresh={fetchWorkers}
      />

      {isModalOpen && (
        <AddWorkerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddWorker}
          serviceProviderId={user?.serviceProviderId}
        />
      )}
    </div>
  );
};

export default WorkersList;