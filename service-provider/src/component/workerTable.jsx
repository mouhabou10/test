import React, { useState } from 'react';
import './ResultTable.css';
import WorkerModal from './WorkerModal';
import axios from 'axios';

const WorkerTable = ({ data, fetchWorkers }) => {
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleView = (worker) => {
    setSelectedWorker(worker);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedWorker(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/workers/${id}`);
      fetchWorkers();
      handleClose();
    } catch (err) {
      console.error('Failed to delete worker:', err);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(`http://localhost:3000/api/v1/workers/${id}`, updatedData);
      fetchWorkers();
      handleClose();
    } catch (err) {
      console.error('Failed to update worker:', err);
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
                  <td>{item.id}</td>
                  <td>{item.worker}</td>
                  <td>{item.phone}</td>
                  <td>{item.title}</td>
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

      {showModal && (
  <WorkerModal
    worker={selectedWorker}
    onClose={handleClose}
    onDelete={handleDelete}
    onUpdate={handleUpdate}
  />
)}

    </div>
  );
};

export default WorkerTable;
