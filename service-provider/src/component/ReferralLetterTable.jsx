import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import './ReferralLetterTable.css';

const ReferralLetterTable = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [document, setDocument] = useState(null);

  const [acceptDate, setAcceptDate] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [actionType, setActionType] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user || !user.serviceProviderId) {
        setLoading(false);
        return;
      }

      const serviceProviderId = user.serviceProviderId;
      console.log(`Fetching appointments for serviceProviderId: ${serviceProviderId}`);

      try {
        const response = await axios.get("http://localhost:3000/api/v1/appointments");
        const allAppointments = response.data.data;
        console.log("All appointments fetched:", allAppointments);

        const filteredAppointments = allAppointments.filter(
          (appt) =>
            appt.serviceProviderId === serviceProviderId &&
            appt.appointmentType === "operation"
        );

        console.log("Filtered operation appointments:", filteredAppointments);
        setAppointments(filteredAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const handleView = async (appointment) => {
    console.log("Viewing appointment:", appointment);
    setSelectedAppointment(appointment);
    setDocument(null);
    setShowModal(true);
    setAcceptDate('');
    setRejectReason('');
    setActionType(null);

    const docId =
      appointment.document &&
      (typeof appointment.document === 'string'
        ? appointment.document
        : appointment.document._id);

    if (docId) {
      console.log(`Fetching document with ID: ${docId}`);
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/documents/${docId}`);
        console.log("Document fetched:", res.data.data);
        setDocument(res.data.data);
      } catch (error) {
        console.error("Error fetching document:", error);
        setDocument(null);
      }
    }
  };
  const handleAcceptSubmit = async () => {
    if (!acceptDate) {
      alert('Please select a consultation date');
      return;
    }
    setSubmitting(true);
  
    const formattedDate = new Date(acceptDate).toISOString(); // Already correct
  
    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/appointments/${selectedAppointment._id}/status`,
        {
          status: 'accepted',
          appointmentDate: formattedDate, // Ensure it's properly formatted
        }
      );
  
      alert('Appointment accepted successfully');
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === selectedAppointment._id
            ? { ...appt, status: 'accepted', appointmentDate: formattedDate }
            : appt
        )
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert('Failed to update appointment');
      setSubmitting(false);
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
    setDocument(null);
    setAcceptDate('');
    setRejectReason('');
    setActionType(null);
    setSubmitting(false);
  };

  const handleAcceptClick = () => {
    console.log("Accept clicked");
    setActionType('accept');
    setRejectReason('');
  };

  const handleRejectClick = () => {
    console.log("Reject clicked");
    setActionType('reject');
    setAcceptDate('');
  };


  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      alert('Please enter a reason for rejection');
      return;
    }
    setSubmitting(true);
    console.log(`Submitting REJECT update for appointment ID: ${selectedAppointment._id}`);
    console.log(`PUT URL: http://localhost:3000/api/v1/appointments/${selectedAppointment._id}/status`);
    console.log("Payload:", { status: 'rejected', rejectionReason: rejectReason.trim() });

    try {
      await axios.put(`http://localhost:3000/api/v1/appointments/${selectedAppointment._id}/status`, {
        status: 'rejected',
        rejectionReason: rejectReason.trim(),
      });

      alert('Appointment rejected successfully');
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === selectedAppointment._id
            ? { ...appt, status: 'rejected', rejectionReason: rejectReason.trim() }
            : appt
        )
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert('Failed to update appointment');
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Referral Letters - Operation Appointments</h2>
      {appointments.length === 0 ? (
        <p>No operation appointments found for this provider.</p>
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
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <td>{appt.clientId}</td>
                <td>{appt.appointmentType}</td>
                <td>{new Date(appt.appointmentDate).toLocaleString()}</td>
                <td>{appt.status}</td>
                <td>
                  <button onClick={() => handleView(appt)} disabled={submitting}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Appointment Details</h3>
            <p><strong>ID:</strong> {selectedAppointment._id}</p>
            <p><strong>Client:</strong> {selectedAppointment.clientId}</p>
            <p><strong>Type:</strong> {selectedAppointment.appointmentType}</p>
            <p><strong>Date:</strong> {new Date(selectedAppointment.appointmentDate).toLocaleString()}</p>
            <p><strong>Status:</strong> {selectedAppointment.status}</p>
            <p><strong>Notes:</strong> {selectedAppointment.notes || 'No notes'}</p>

            {document ? (
              <a
                href={`http://localhost:3000/${document.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="download-link"
              >
                Download Referral Letter
              </a>
            ) : (
              <p>No referral letter attached or document loading...</p>
            )}

            <div style={{ marginTop: '1rem' }}>
              {!actionType && (
                <>
                  <button onClick={handleAcceptClick} disabled={submitting}>Accept</button>
                  <button onClick={handleRejectClick} disabled={submitting}>Reject</button>
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

export default ReferralLetterTable;
