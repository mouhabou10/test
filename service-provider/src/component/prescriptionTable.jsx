import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ResultTable.css';
import { format } from 'date-fns';

const PrescriptionTable = ({ filters = {} }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusData, setStatusData] = useState({});
  const [appointment, setAppointment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showAcceptField, setShowAcceptField] = useState(false);
  const [showRejectField, setShowRejectField] = useState(false);
  
  useEffect(() => {
    const fetchRadioAppointments = async () => {
      try {
        // Fetch all radio appointments from the API
        const res = await axios.get('http://localhost:3000/api/v1/appointments/radio');
        setPrescriptions(res.data.data);
        setFilteredPrescriptions(res.data.data);
      } catch (error) {
        console.error('Failed to fetch radio appointments:', error);
      }
    };

    fetchRadioAppointments();
  }, []);
  
  // Apply filters when filters change
  useEffect(() => {
    if (!filters || Object.keys(filters).length === 0) {
      setFilteredPrescriptions(prescriptions);
      return;
    }
    
    const { searchQuery, statusFilter, dateFilter } = filters;
    
    let filtered = [...prescriptions];
    
    // Filter by search query (patient name/email)
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        const clientName = item.clientId?.name?.toLowerCase() || '';
        const clientEmail = item.clientId?.email?.toLowerCase() || '';
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
        if (!item.appointmentDate) return false;
        const appointmentDate = new Date(item.appointmentDate).setHours(0, 0, 0, 0);
        return appointmentDate === filterDate;
      });
    }
    
    setFilteredPrescriptions(filtered);
  }, [filters, prescriptions]);

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

  const confirmAccept = async () => {
    try {
      // Update appointment status to 'accepted' in the backend
      await axios.put(`http://localhost:3000/api/v1/appointments/${selectedPrescription._id}/status`, {
        status: 'accepted',
        notes: appointment
      });
      
      setStatusData(prev => ({
        ...prev,
        [selectedPrescription._id]: { status: 'Accepted', detail: appointment }
      }));
      
      // Refresh appointments after update
      const res = await axios.get('http://localhost:3000/api/v1/appointments/radio');
      setPrescriptions(res.data.data);
      setFilteredPrescriptions(res.data.data);
      
      handleCloseModal();
    } catch (error) {
      console.error('Failed to accept appointment:', error);
      alert('Failed to update appointment status');
    }
  };

  const confirmReject = async () => {
    try {
      // Update appointment status to 'cancelled' in the backend
      await axios.put(`http://localhost:3000/api/v1/appointments/${selectedPrescription._id}/status`, {
        status: 'cancelled',
        notes: rejectionReason
      });
      
      setStatusData(prev => ({
        ...prev,
        [selectedPrescription._id]: { status: 'Rejected', detail: rejectionReason }
      }));
      
      // Refresh appointments after update
      const res = await axios.get('http://localhost:3000/api/v1/appointments/radio');
      setPrescriptions(res.data.data);
      setFilteredPrescriptions(res.data.data);
      
      handleCloseModal();
    } catch (error) {
      console.error('Failed to reject appointment:', error);
      alert('Failed to update appointment status');
    }
  };

  const getStatusDisplay = (appointment) => {
    // First check our local state for any updates we've made
    if (statusData[appointment._id]) {
      return `${statusData[appointment._id].status} ${statusData[appointment._id].detail ? `: ${statusData[appointment._id].detail}` : ''}`;
    }
    
    // Otherwise use the appointment status from the database
    const statusMap = {
      'pending': 'Pending',
      'accepted': 'Accepted',
      'cancelled': 'Rejected',
      'completed': 'Completed'
    };
    
    return statusMap[appointment.status] || 'Pending';
  };

  return (
    <div className="card-container">
      <div className="table-container">
        <table className="patient-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Provider</th>
              <th>Client</th>
              <th>Date</th>
              <th>Prescription</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrescriptions.length > 0 ? (
              filteredPrescriptions.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.serviceProviderId?.name || 'N/A'}</td>
                  <td>{item.clientId?.name || item.clientId?.email || 'N/A'}</td>
                  <td>{item.appointmentDate ? format(new Date(item.appointmentDate), 'MMM dd, yyyy') : 'Not set'}</td>
                  <td>
                    {item.document ? (
                      <a
                        href={`http://localhost:3000/${item.document.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Prescription
                      </a>
                    ) : 'No document'}
                  </td>
                  <td>{getStatusDisplay(item)}</td>
                  <td>
                    <button className="action-btn" onClick={() => handleView(item)}>View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedPrescription && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Radio Appointment Details</h2>
            <p><strong>ID:</strong> {selectedPrescription._id}</p>
            <p><strong>Type:</strong> {selectedPrescription.appointmentType}</p>
            <p><strong>Provider:</strong> {selectedPrescription.serviceProviderId?.name || 'N/A'}</p>
            <p><strong>Client:</strong> {selectedPrescription.clientId?.name || selectedPrescription.clientId?.email || 'N/A'}</p>
            <p><strong>Date:</strong> {selectedPrescription.appointmentDate ? format(new Date(selectedPrescription.appointmentDate), 'MMM dd, yyyy HH:mm') : 'Not set'}</p>
            <p><strong>Status:</strong> {getStatusDisplay(selectedPrescription)}</p>
            <p><strong>Notes:</strong> {selectedPrescription.notes || 'No notes'}</p>
            {selectedPrescription.document && (
              <a
                href={`http://localhost:3000/${selectedPrescription.document.path}`}
                download
                className="download-btn"
              >
                Download Prescription
              </a>
            )}

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
