import React, { useState } from 'react';
import axios from 'axios';
import './ServiceProviderTable.css';

const ServiceProviderTable = ({ data }) => {
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewMore = (item) => {
    setSelected(item);
    setShowModal(true);
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(`http://localhost:3000/api/v1/account-demands/approve/${id}`);
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      console.error('Failed to approve:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/account-demands/${id}`);
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      console.error('Failed to reject:', err);
    }
  };

  return (
    <div className="service-provider-table-container">
      <table className="service-provider-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Account Type</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Wilaya</th>
            <th>Speciality</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td>{item._id}</td>
                <td>{item.type}</td>
                <td>{item.fullName}</td>
                <td>{item.email}</td>
                <td>{item.wilaya}</td>
                <td>{item.speciality || '-'}</td>
                <td>
                  <button onClick={() => handleViewMore(item)} className="action-btn view">🔍 View More</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-data">No pending account demands</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && selected && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Account Demand Details</h3>
            <p><strong>ID:</strong> {selected._id}</p>
            <p><strong>Full Name:</strong> {selected.fullName}</p>
            <p><strong>Email:</strong> {selected.email}</p>
            <p><strong>Wilaya:</strong> {selected.wilaya}</p>
            <p><strong>Account Type:</strong> {selected.type}</p>
            <p><strong>Speciality:</strong> {selected.speciality || '-'}</p>
            <p><strong>Director ID:</strong> {selected.directorId}</p>
            {/* Add more fields if needed */}

            <div className="modal-actions">
              <button onClick={() => handleApprove(selected._id)} className="action-btn approve">✅ Approve</button>
              <button onClick={() => handleReject(selected._id)} className="action-btn reject">❌ Reject</button>
              <button onClick={() => setShowModal(false)} className="action-btn cancel">✖ Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceProviderTable;
