import React, { useState } from 'react';
import './ResultTable.css';

const ResultTable = ({ data }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleView = (doc) => {
    setSelectedDoc(doc);
  };

  const closeModal = () => {
    setSelectedDoc(null);
  };

  return (
    <div className="card-container">
      <div className="table-container">
        <table className="patient-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Uploaded By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.title}</td>
                  <td>{item.type}</td>
                  <td>{item.createdBy?.name || 'N/A'}</td>
                  <td>
                    <button className="action-btn" onClick={() => handleView(item)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedDoc && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedDoc.title}</h2>
            <p><strong>Type:</strong> {selectedDoc.type}</p>
            <p><strong>Uploaded By:</strong> {selectedDoc.createdBy?.name || 'N/A'}</p>
            <p><strong>Client:</strong> {selectedDoc.client?.name || 'N/A'}</p>
            <a
              href={`http://localhost:3000/${selectedDoc.path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="download-link"
            >
              📥 Download File
            </a>
            <button className="close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultTable;
