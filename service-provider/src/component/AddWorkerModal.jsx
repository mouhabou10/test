// AddWorkerModal.jsx
import React, { useState, useEffect } from 'react';

const SPECIALTIES = [
  'Cardiology',
  'Dermatology', 
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Oncology',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Surgery'
];

const ROLES = [
  'manager',
  'chef Department',
  'laboAgent',
  'radioAgent',
  'consultation agent'
];

const AddWorkerModal = ({ isOpen, onClose, onSubmit, serviceProviderId }) => {
  const [formData, setFormData] = useState({
    jobId: '',
    fullName: '',
    phoneNumber: '',
    role: '',
    email: '',
    password: '',
    speciality: '',
    serviceProvider: serviceProviderId
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Worker</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Job ID
            <input type="text" name="jobId" value={formData.jobId} onChange={handleChange} required />
          </label>

          <label>
            Full Name
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </label>

          <label>
            Phone Number
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          </label>

          <label>
            Role
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="">Select Role</option>
              {ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </label>

          <label>
            Email
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>

          <label>
            Password
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </label>

          <label>
            Speciality
            <select name="speciality" value={formData.speciality} onChange={handleChange} required>
              <option value="">Select Speciality</option>
              {SPECIALTIES.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </label>

          <div className="modal-actions">
            <button type="submit" className="submit-btn">Add Worker</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWorkerModal;