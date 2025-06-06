import React, { useState } from 'react';
import './ResultTable.css';

const ResultTable = ({ data }) => {
  const [selectedResult, setSelectedResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleView = (result) => {
    setSelectedResult(result);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedResult(null);
  };

  return (
    <div className="table-container">
      <table className="result-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.title || 'N/A'}</td>
                <td>{item.type}</td>
                <td>
                  <button className="action-btn view" onClick={() => handleView(item)}>
                    View
                  </button>
                  <a
                    href={`http://localhost:3000/${item.path}`}
                    download
                    className="action-btn download"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-data">No results available</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && selectedResult && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Result Details</h2>
            <p><strong>ID:</strong> {selectedResult._id}</p>
            <p><strong>Title:</strong> {selectedResult.title || 'N/A'}</p>
            <p><strong>Type:</strong> {selectedResult.type}</p>
            <p><strong>Path:</strong> {selectedResult.path}</p>
            <button className="close-btn" onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultTable;
