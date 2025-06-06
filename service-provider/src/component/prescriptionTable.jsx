import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './ResultTable.css';
import { AuthContext } from "../context/AuthContext.jsx";

const PrescriptionTable = () => {

  const { user } = useContext(AuthContext);

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [acceptDate, setAcceptDate] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [actionType, setActionType] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [document, setDocument] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/v1/appointments');
        const allAppointments = response.data.data;

        console.log("User role:", user.role);
        console.log("User serviceProviderId:", user.serviceProviderId);

        // Filtering logic based on role and serviceProviderId
        let filteredData = allAppointments.filter((appt) => {
          const belongsToServiceProvider =
            appt.serviceProviderId === user.serviceProviderId;

          if (!belongsToServiceProvider) return false;

          if (user.role === 'radioAgent') {
            return appt.appointmentType === 'radio';
          } else if (user.role === 'laboAgent') {
            return appt.appointmentType === 'labo';
          } else {
            return appt.document?.type === 'Ordonnance';
          }
        });

        setPrescriptions(filteredData);
      } catch (error) {
        console.error('Failed to fetch prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [user]);

  const handleView = async (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
    setAcceptDate('');
    setRejectReason('');
    setActionType(null);
    setSubmitting(false);
    setDocument(null);

    const docId =
      typeof prescription.document === 'string'
        ? prescription.document
        : prescription.document?._id;

    if (docId) {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/documents/${docId}`);
        setDocument(res.data.data);
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPrescription(null);
    setAcceptDate('');
    setRejectReason('');
    setActionType(null);
    setSubmitting(false);
  };

  const handleAcceptSubmit = async () => {
    if (!acceptDate) {
      alert('Please select a consultation date');
      return;
    }
    setSubmitting(true);

    try {
      const formattedDate = new Date(acceptDate).toISOString();
      await axios.put(
        `http://localhost:3000/api/v1/appointments/${selectedPrescription._id}/status`,
        {
          status: 'accepted',
          appointmentDate: formattedDate,
        }
      );

      alert('Prescription accepted successfully');
      setPrescriptions((prev) =>
        prev.map((p) =>
          p._id === selectedPrescription._id
            ? { ...p, status: 'accepted', appointmentDate: formattedDate }
            : p
        )
      );
      handleCloseModal();
    } catch (error) {
      console.error('Error updating prescription:', error);
      alert('Failed to update prescription');
      setSubmitting(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      alert('Please enter a reason for rejection');
      return;
    }
    setSubmitting(true);

    try {
      await axios.put(
        `http://localhost:3000/api/v1/appointments/${selectedPrescription._id}/status`,
        {
          status: 'rejected',
          rejectionReason: rejectReason.trim(),
        }
      );

      alert('Prescription rejected successfully');
      setPrescriptions((prev) =>
        prev.map((p) =>
          p._id === selectedPrescription._id
            ? { ...p, status: 'rejected', rejectionReason: rejectReason.trim() }
            : p
        )
      );
      handleCloseModal();
    } catch (error) {
      console.error('Error updating prescription:', error);
      alert('Failed to update prescription');
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="back">
      <h2>Prescriptions</h2>
      {prescriptions.length === 0 ? (
        <p>No prescriptions found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((p) => (
              <tr key={p._id}>
                <td>{p.clientId}</td>
                <td>{p.appointmentType}</td>
                <td>{p.appointmentDate ? new Date(p.appointmentDate).toLocaleString() : 'N/A'}</td>
                <td>{p.status}</td>
                <td>
                  <button onClick={() => handleView(p)} disabled={submitting}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && selectedPrescription && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Prescription Details</h3>
            <p><strong>ID:</strong> {selectedPrescription._id}</p>
            <p><strong>Client:</strong> {selectedPrescription.clientId}</p>
            <p><strong>Type:</strong> {selectedPrescription.appointmentType}</p>
            <p><strong>Date:</strong> {selectedPrescription.appointmentDate ? new Date(selectedPrescription.appointmentDate).toLocaleString() : 'Not set'}</p>
            <p><strong>Status:</strong> {selectedPrescription.status}</p>
            <p><strong>Notes:</strong> {selectedPrescription.notes || 'No notes'}</p>

            {document ? (
              <a
                href={`http://localhost:3000/${document.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="download-link"
              >
                Download Prescription File
              </a>
            ) : (
              <p>No document available.</p>
            )}

            <div style={{ marginTop: '1rem' }}>
              {!actionType && (
                <>
                  <button onClick={() => setActionType('accept')} disabled={submitting}>Accept</button>
                  <button onClick={() => setActionType('reject')} disabled={submitting}>Reject</button>
                </>
              )}

              {actionType === 'accept' && (
                <div style={{ marginTop: '1rem' }}>
                  <label>
                    Consultation Date:{" "}
                    <input
                      type="date"
                      value={acceptDate}
                      onChange={(e) => setAcceptDate(e.target.value)}
                      disabled={submitting}
                    />
                  </label>
                  <button onClick={handleAcceptSubmit} disabled={submitting} style={{ marginLeft: '0.5rem' }}>
                    Submit
                  </button>
                  <button onClick={() => setActionType(null)} disabled={submitting} style={{ marginLeft: '0.5rem' }}>
                    Cancel
                  </button>
                </div>
              )}

              {actionType === 'reject' && (
                <div style={{ marginTop: '1rem' }}>
                  <label>
                    Reason for Rejection:{" "}
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      disabled={submitting}
                    />
                  </label>
                  <button onClick={handleRejectSubmit} disabled={submitting} style={{ marginLeft: '0.5rem' }}>
                    Submit
                  </button>
                  <button onClick={() => setActionType(null)} disabled={submitting} style={{ marginLeft: '0.5rem' }}>
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <button className="close-btn" onClick={handleCloseModal} disabled={submitting} style={{ marginTop: '1rem' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionTable;
