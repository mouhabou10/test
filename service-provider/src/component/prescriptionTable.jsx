import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ResultTable.css';

const PrescriptionTable = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusData, setStatusData] = useState({});
  const [appointment, setAppointment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showAcceptField, setShowAcceptField] = useState(false);
  const [showRejectField, setShowRejectField] = useState(false);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/documents');
        const ordonnancePrescriptions = res.data.data.filter(doc => doc.type === 'Ordonnance');
        setPrescriptions(ordonnancePrescriptions);
      } catch (error) {
        console.error('Failed to fetch prescriptions:', error);
      }
    };

    fetchPrescriptions();
  }, []);

  const handleView = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
    setShowAcceptField(false);
    setShowRejectField(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPrescription(null);
    setAppointment('');
    setRejectionReason('');
  };

  const handleAccept = () => {
    setShowAcceptField(true);
    setShowRejectField(false);
  };

  const handleReject = () => {
    setShowRejectField(true);
    setShowAcceptField(false);
  };

  const confirmAccept = () => {
    setStatusData(prev => ({
      ...prev,
      [selectedPrescription._id]: { status: 'Accepted', detail: appointment }
    }));
    handleCloseModal();
  };

  const confirmReject = () => {
    setStatusData(prev => ({
      ...prev,
      [selectedPrescription._id]: { status: 'Rejected', detail: rejectionReason }
    }));
    handleCloseModal();
  };

  const getStatusDisplay = (id) => {
    if (!statusData[id]) return 'Pending';
    return `${statusData[id].status} ${statusData[id].detail ? `: ${statusData[id].detail}` : ''}`;
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
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.length > 0 ? (
              prescriptions.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.createdBy}</td>
                  <td>{item.client}</td>
                  <td>
                    <a
                      href={`http://localhost:3000/${item.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Content
                    </a>
                  </td>
                  <td>{getStatusDisplay(item._id)}</td>
                  <td>
                    <button className="action-btn" onClick={() => handleView(item)}>View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedPrescription && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Prescription Details</h2>
            <p><strong>ID:</strong> {selectedPrescription._id}</p>
            <p><strong>Title:</strong> {selectedPrescription.title}</p>
            <p><strong>Type:</strong> {selectedPrescription.type}</p>
            <p><strong>Doctor (createdBy):</strong> {selectedPrescription.createdBy}</p>
            <p><strong>Client:</strong> {selectedPrescription.client}</p>
            <a
              href={`http://localhost:3000/${selectedPrescription.path}`}
              download
              className="download-btn"
            >
              Download File
            </a>

            <div className="modal-actions">
              <button className="accept-btn" onClick={handleAccept}>Accept</button>
              <button className="reject-btn" onClick={handleReject}>Reject</button>
              <button className="close-btn" onClick={handleCloseModal}>Cancel</button>
            </div>

            {showAcceptField && (
              <div className="modal-input-group">
                <input
                  type="text"
                  placeholder="Enter appointment date/time"
                  value={appointment}
                  onChange={(e) => setAppointment(e.target.value)}
                />
                <button className="confirm-btn" onClick={confirmAccept}>Confirm Accept</button>
              </div>
            )}

            {showRejectField && (
              <div className="modal-input-group">
                <input
                  type="text"
                  placeholder="Enter rejection reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
                <button className="confirm-btn" onClick={confirmReject}>Confirm Reject</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionTable;
