import React, { useState } from 'react';
import './ResultTable.css';
import axios from 'axios';
import WorkerModal from './WorkerModal.jsx';

const WorkerTable = ({ data, fetchWorkers }) => {
  const [selectedWorker, setSelectedWorker] = useState(null);

  const handleView = (worker) => {
    setSelectedWorker(worker);
  };

  const handleClose = () => {
    setSelectedWorker(null);
  };

  const handleDelete = async (workerId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/workers/${workerId}`);
      fetchWorkers(); // Refresh data
      handleClose(); // Close modal
    } catch (err) {
      console.error('Failed to delete worker:', err);
      alert('Error deleting worker');
    }
  };

  return (
    <div className="card-container">
      <div className="table-container">
        <table className="worker-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Worker</th>
              <th>Phone</th>
              <th>Title</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td>{item.jobId}</td>
                  <td>{item.fullName}</td>
                  <td>{item.phoneNumber}</td>
                  <td>{item.speciality}</td>
                  <td>{item.email}</td>
                  <td>
                    <button className="action-btn" onClick={() => handleView(item)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedWorker && (
        <WorkerModal
          worker={selectedWorker}
          onClose={handleClose}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default WorkerTable;
