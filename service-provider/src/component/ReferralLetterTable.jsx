import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ResultTable.css';

const ReferralLetterTable = () => {
  const [letters, setLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/documents');
        const filtered = res.data.data.filter(doc => doc.type === 'Lettre d’orientation');
        setLetters(filtered);
      } catch (error) {
        console.error('Failed to fetch referral letters:', error);
      }
    };

    fetchLetters();
  }, []);

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
              <th>Content</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {letters.length > 0 ? (
              letters.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.createdBy?.name || 'N/A'}</td>
                  <td>{item.client?.name || 'N/A'}</td>
                  <td>
                    <a
                      href={`http://localhost:3000/${item.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Content
                    </a>
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => handleView(item)}>View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">No referral letters available</td>
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
            <p><strong>Client:</strong> {selectedLetter.client?.name || 'N/A'}</p>
            <a
              href={`http://localhost:3000/${selectedLetter.path}`}
              download
              className="download-btn"
            >
              Download File
            </a>
            <button onClick={handleCloseModal} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralLetterTable;
