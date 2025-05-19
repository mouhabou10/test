import React from 'react';
import './Modal.css';

const WorkerModal = ({ worker, onClose, onDelete, onUpdate }) => {
  if (!worker) return null;

  // Worker has user info nested inside `worker.user`
  const { user, jobId, speciality, serviceProvider, _id } = worker;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Worker Details</h2>

        <p><strong>Full Name:</strong> {user?.fullName || '-'}</p>
        <p><strong>Email:</strong> {user?.email || '-'}</p>
        <p><strong>Phone Number:</strong> {user?.phoneNumber || '-'}</p>
        <p><strong>Role:</strong> {user?.role || '-'}</p>

        <p><strong>Job ID:</strong> {jobId}</p>
        <p><strong>Speciality:</strong> {speciality}</p>
        <p><strong>Service Provider:</strong> {serviceProvider?.name || '-'}</p>

        <div className="modal-actions">
          <button className="delete-btn" onClick={() => onDelete(_id)}>Delete</button>
          {/* Add update button if needed */}
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default WorkerModal;
