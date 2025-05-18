import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter, Plus } from 'lucide-react';
import "./list.css";
import WorkerTable from './workerTable.jsx';
import AddWorkerModal from './AddWorkerModal.jsx';

const WorkersList = () => {
  const [workers, setWorkers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const serviceProviderId = "68287dd360af7babbb0f06ac"; // ✅ Your actual ID

  const fetchWorkers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/v1/workers');
      setWorkers(res.data.data);
    } catch (err) {
      console.error('Failed to fetch workers:', err);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleAddWorker = async (formData) => {
    try {
      await axios.post('http://localhost:3000/api/v1/workers', formData);
      setIsModalOpen(false);
      fetchWorkers();
    } catch (err) {
      console.error('Failed to add worker:', err);
      alert('Failed to add worker');
    }
  };

  return (
    <div className='carder'>
      <form action="">
        <input type="text" className='names' placeholder="Search worker" />
        <select name="title" id="title">
          <option value="consultation-agent">Consultation Agent</option>
          <option value="labo-agent">Labo Agent</option>
          <option value="radio-agent">Radio Agent</option>
          <option value="department-chef">Department Chef</option>
        </select>
        <input type="date" className="date-picker" />
        <button type='submit' className='filter-button'>
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

      <WorkerTable data={workers} />

      <AddWorkerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddWorker}
        serviceProviderId={serviceProviderId} // ✅ Send this to modal
      />
    </div>
  );
};

export default WorkersList;
