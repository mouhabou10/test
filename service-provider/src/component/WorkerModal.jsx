import React from 'react';
import './Modal.css'; // style this as needed

const WorkerModal = ({ worker, onClose, onDelete }) => {
  if (!worker) return null;

  const handleDelete = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this worker?');
    if (confirmDelete) {
      onDelete(worker._id);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Worker Details</h2>
        <div className="worker-details">
          <p><strong>Job ID:</strong> {worker.jobId}</p>
          <p><strong>Full Name:</strong> {worker.fullName}</p>
          <p><strong>Phone Number:</strong> {worker.phoneNumber}</p>
          <p><strong>Role:</strong> {worker.role}</p>
          <p><strong>Email:</strong> {worker.email}</p>
          <p><strong>Speciality:</strong> {worker.speciality}</p>
        </div>

        <div className="modal-actions">
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default WorkerModal;
