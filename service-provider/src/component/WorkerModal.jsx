import React, { useState } from 'react';
import './Modal.css';

const WorkerModal = ({ worker, onClose, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    jobId: worker.jobId || '',
    speciality: worker.speciality || '',
    user: {
      fullName: worker.user?.fullName || '',
      phoneNumber: worker.user?.phoneNumber || '',
      role: worker.user?.role || '',
      email: worker.user?.email || '',
    }
  });

  if (!worker) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (['fullName', 'phoneNumber', 'role', 'email'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          [name]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
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
    setFormData({
      jobId: worker.jobId || '',
      speciality: worker.speciality || '',
      user: {
        fullName: worker.user?.fullName || '',
        phoneNumber: worker.user?.phoneNumber || '',
        role: worker.user?.role || '',
        email: worker.user?.email || '',
      }
    });
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
          {/* User fields */}
          {["fullName", "phoneNumber", "role", "email"].map((field) => (
            <p key={field}>
              <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{' '}
              {isEditing ? (
                <input
                  type="text"
                  name={field}
                  value={formData.user[field]}
                  onChange={handleChange}
                />
              ) : (
                worker.user?.[field] || '-'
              )}
            </p>
          ))}

          {/* Worker fields */}
          {["jobId", "speciality"].map((field) => (
            <p key={field}>
              <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{' '}
              {isEditing ? (
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                />
              ) : (
                worker[field] || '-'
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
