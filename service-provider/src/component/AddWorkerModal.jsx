import React, { useState } from 'react';

const AddWorkerModal = ({ isOpen, onClose, onSubmit, serviceProviderId }) => {
  const [formData, setFormData] = useState({
    jobId: '',
    fullName: '',
    phoneNumber: '',
    role: '',
    email: '',
    password: '',
    speciality: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      serviceProvider: serviceProviderId,
    };
    onSubmit(dataToSubmit);
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
              <option value="manager">Manager</option>
              <option value="chef Department">Chef Department</option>
              <option value="laboAgent">Labo Agent</option>
              <option value="radioAgent">Radio Agent</option>
              <option value="consultation agent">Consultation Agent</option>
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
            <input type="text" name="speciality" value={formData.speciality} onChange={handleChange} required />
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
