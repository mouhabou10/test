import React from 'react';
import './Modal.css';
import axios from 'axios';

const Modal = ({ data, onClose }) => {

  const handleApprove = async () => {
    try {
      await axios.post(`http://localhost:3000/api/v1/account-demands/approve/${data._id}`);
      onClose();
      window.location.reload();
    } catch (err) {
      console.error('Failed to approve:', err);
    }
  };

  const handleReject = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/account-demands/${data._id}`);
      onClose();
      window.location.reload();
    } catch (err) {
      console.error('Failed to reject:', err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Account Demand Details</h2>
        <p><strong>ID:</strong> {data._id}</p>
        <p><strong>Account Type:</strong> {data.type}</p>
        <p><strong>Full Name:</strong> {data.fullName}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Wilaya:</strong> {data.wilaya}</p>
        <p><strong>Speciality:</strong> {data.speciality || '-'}</p>

        <div className="modal-actions">
          <button className="approve-btn" onClick={handleApprove}>✅ Approve</button>
          <button className="reject-btn" onClick={handleReject}>❌ Reject</button>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
