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

  return (
    <div className="card-container">
      <div className="table-container">
        <table className="worker-table">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Speciality</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((worker) => (
                <tr key={worker._id}>
                  <td>{worker.jobId}</td>
                  <td>{worker.user?.fullName}</td>
                  <td>{worker.user?.email}</td>
                  <td>{worker.user?.phoneNumber}</td>
                  <td>{worker.user?.role}</td>
                  <td>{worker.speciality}</td>
                  <td>
                    <button className="action-btn" onClick={() => handleView(worker)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">No workers available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedWorker && (
        <WorkerModal
          worker={selectedWorker}
          onClose={() => setShowModal(false)}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default WorkerTable;