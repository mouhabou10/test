import React, { useState } from 'react';
import axios from 'axios';
import './ResultTable.css';

const AddResultModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    createdBy: '',
    file: null
  });

  const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id); // MongoDB ObjectId check

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidObjectId(formData.client) || !isValidObjectId(formData.createdBy)) {
      alert("Client ID and CreatedBy must be valid MongoDB ObjectIds (24 characters).");
      return;
    }

    const resultData = new FormData();
    resultData.append('title', formData.title);
    resultData.append('client', formData.client);
    resultData.append('createdBy', formData.createdBy);
    resultData.append('type', 'Résultat');
    resultData.append('file', formData.file);

    try {
      await axios.post('http://localhost:3000/api/v1/documents', resultData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content scrollable-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add Result</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />

          <label>Client ID:</label>
          <input type="text" name="client" value={formData.client} onChange={handleChange} required />

          <label>Created By (User ID):</label>
          <input type="text" name="createdBy" value={formData.createdBy} onChange={handleChange} required />

          <label>File:</label>
          <input type="file" name="file" accept=".pdf,.doc,.docx,.png,.jpg" onChange={handleChange} required />

          <button type="submit" className="action-btn">Submit</button>
          <button type="button" className="close-btn" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddResultModal;
