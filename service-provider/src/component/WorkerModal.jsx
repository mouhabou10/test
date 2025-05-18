import React, { useState } from 'react';
import './Modal.css';

const WorkerModal = ({ worker, onClose, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...worker });

  if (!worker) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this worker?');
    if (confirmDelete) {
      onDelete(worker._id);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData({ ...worker });
    setIsEditing(false);
  };

  const handleSave = () => {
    onUpdate(worker._id, formData);
    setIsEditing(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Worker {isEditing ? 'Edit' : 'Details'}</h2>
        <div className="worker-details">
          {["jobId", "fullName", "phoneNumber", "role", "email", "speciality"].map((name) => (
            <p key={name}>
              <strong>{name.charAt(0).toUpperCase() + name.slice(1)}:</strong>{' '}
              {isEditing ? (
                <input
                  type="text"
                  name={name}
                  value={formData[name] || ''}
                  onChange={handleChange}
                />
              ) : (
                worker[name]
              )}
            </p>
          ))}
        </div>

        <div className="modal-actions">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
            </>
          ) : (
            <>
              <button className="edit-btn" onClick={handleEdit}>Edit</button>
              <button className="delete-btn" onClick={handleDelete}>Delete</button>
              <button className="cancel-btn" onClick={onClose}>Close</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerModal;

