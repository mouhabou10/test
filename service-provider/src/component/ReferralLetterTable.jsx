import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ResultTable.css';
import { format } from 'date-fns';

const ReferralLetterTable = ({ filters = {} }) => {
  const [letters, setLetters] = useState([]);
  const [filteredLetters, setFilteredLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/documents');
        const filtered = res.data.data.filter(doc => doc.type === "Lettre d'orientation");
        setLetters(filtered);
        setFilteredLetters(filtered);
      } catch (error) {
        console.error('Failed to fetch referral letters:', error);
      }
    };
    fetchLetters();
  }, []);

  useEffect(() => {
    if (!filters || Object.keys(filters).length === 0) {
      setFilteredLetters(letters);
      return;
    }
    const { searchQuery, statusFilter, dateFilter } = filters;
    let filtered = [...letters];

    // Filter by search query (patient name/email)
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        const clientName = item.client?.name?.toLowerCase() || '';
        const clientEmail = item.client?.email?.toLowerCase() || '';
        return clientName.includes(query) || clientEmail.includes(query);
      });
    }

    // Filter by status
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Filter by date
    if (dateFilter) {
      const filterDate = new Date(dateFilter).setHours(0, 0, 0, 0);
      filtered = filtered.filter(item => {
        if (!item.createdAt) return false;
        const createdDate = new Date(item.createdAt).setHours(0, 0, 0, 0);
        return createdDate === filterDate;
      });
    }

    setFilteredLetters(filtered);
  }, [filters, letters]);

  const handleView = (letter) => {
    setSelectedLetter(letter);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLetter(null);
  };

  return (
    <div className="card-container">
      <div className="table-container">
        <table className="patient-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Doctor</th>
              <th>Client</th>
              <th>Date</th>
              <th>Letter</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLetters.length > 0 ? (
              filteredLetters.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.createdBy?.name || 'N/A'}</td>
                  <td>{item.client?.name || item.client?.email || 'N/A'}</td>
                  <td>{item.createdAt ? format(new Date(item.createdAt), 'MMM dd, yyyy') : 'Not set'}</td>
                  <td>
                    <a
                      href={`http://localhost:3000/${item.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Letter
                    </a>
                  </td>
                  <td>{item.status || 'pending'}</td>
                  <td>
                    <button className="action-btn" onClick={() => handleView(item)}>View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">No referral letters available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedLetter && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Referral Letter Details</h2>
            <p><strong>ID:</strong> {selectedLetter._id}</p>
            <p><strong>Title:</strong> {selectedLetter.title}</p>
            <p><strong>Type:</strong> {selectedLetter.type}</p>
            <p><strong>Doctor:</strong> {selectedLetter.createdBy?.name || 'N/A'}</p>
            <p><strong>Client:</strong> {selectedLetter.client?.name || selectedLetter.client?.email || 'N/A'}</p>
            <p><strong>Date:</strong> {selectedLetter.createdAt ? format(new Date(selectedLetter.createdAt), 'MMM dd, yyyy HH:mm') : 'Not set'}</p>
            <a
              href={`http://localhost:3000/${selectedLetter.path}`}
              download
              className="download-btn"
            >
              Download Letter
            </a>
            <button onClick={handleCloseModal} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralLetterTable;