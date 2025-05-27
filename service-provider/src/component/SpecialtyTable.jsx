import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ResultTable.css'; // Reusing the same design style

const SpecialtyTable = () => {
  const [specialities, setSpecialities] = useState([]); // List of all specialities
  const [assignedSpecialities, setAssignedSpecialities] = useState([]); // Specialities assigned to the service provider
  const [selectedSpeciality, setSelectedSpeciality] = useState(''); // Selected speciality from dropdown
  const [newSpeciality, setNewSpeciality] = useState(''); // New speciality input
  const [error, setError] = useState('');
  const serviceProviderId = JSON.parse(localStorage.getItem('user'))?.serviceProviderId; // Get service provider ID from localStorage

  // Fetch all specialities from the database
  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        console.log('Fetching specialities from:', `${import.meta.env.VITE_API_BASE_URL}/services`);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/services`);
        console.log('Specialities API response:', response.data);
  
        if (response.data?.success) {
          setSpecialities(response.data.data);
          console.log('Specialities set successfully:', response.data.data);
        } else {
          console.error('Failed to fetch specialities:', response.data.message);
        }
      } catch (err) {
        console.error('Error fetching specialities:', err);
        setError('Failed to load specialities. Please try again later.');
      }
    };
  
    const fetchAssignedSpecialities = async () => {
      try {
        console.log('Fetching assigned specialities for service provider:', serviceProviderId);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/service-provider/${serviceProviderId}/specialities`);
        console.log('Assigned specialities API response:', response.data);
  
        if (response.data?.success) {
          setAssignedSpecialities(response.data.data);
          console.log('Assigned specialities set successfully:', response.data.data);
        } else {
          console.error('Failed to fetch assigned specialities:', response.data.message);
        }
      } catch (err) {
        console.error('Error fetching assigned specialities:', err);
        setError('Failed to load assigned specialities. Please try again later.');
      }
    };
  
    fetchSpecialities();
    fetchAssignedSpecialities();
  }, [serviceProviderId]);
  
  const handleAssignSpeciality = async () => {
    try {
      console.log('Assigning speciality. Selected:', selectedSpeciality, 'New:', newSpeciality);
  
      let specialityId = selectedSpeciality;
  
      if (newSpeciality) {
        console.log('Adding new speciality:', newSpeciality);
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/specialities`, { name: newSpeciality });
        console.log('New speciality API response:', response.data);
  
        if (response.data?.success) {
          specialityId = response.data.data._id;
          setSpecialities([...specialities, response.data.data]);
          console.log('New speciality added to dropdown:', response.data.data);
        }
      }
  
      console.log('Assigning speciality ID:', specialityId, 'to service provider:', serviceProviderId);
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/service-providers/${serviceProviderId}/assign-speciality`, {
        specialityId,
      });
  
      const assignedSpeciality = specialities.find((s) => s._id === specialityId) || { name: newSpeciality };
      setAssignedSpecialities([...assignedSpecialities, assignedSpeciality]);
      console.log('Assigned specialities updated:', [...assignedSpecialities, assignedSpeciality]);
  
      setSelectedSpeciality('');
      setNewSpeciality('');
      setError('');
    } catch (err) {
      console.error('Error assigning speciality:', err);
      setError('Failed to assign speciality. Please try again.');
    }
  };
  return (
    <div className="specialty-table-container">
    <div className="form-container">
      <h3>Assign Speciality</h3>
      <div className="form-group">
        <label htmlFor="speciality-selector">Select Speciality:</label>
        <select
          id="speciality-selector"
          value={selectedSpeciality}
          onChange={(e) => setSelectedSpeciality(e.target.value)}
          disabled={!!newSpeciality} // Disable if adding a new speciality
          className="speciality-selector"
        >
          <option value="">-- Select a Speciality --</option>
          {specialities.map((speciality) => (
            <option key={speciality._id} value={speciality._id}>
              {speciality.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="new-speciality">Or Add New Speciality:</label>
        <input
          id="new-speciality"
          type="text"
          placeholder="Enter new speciality"
          value={newSpeciality}
          onChange={(e) => setNewSpeciality(e.target.value)}
          disabled={!!selectedSpeciality} // Disable if a speciality is selected
          className="new-speciality-input"
        />
      </div>

      <button className="assign-btn" onClick={handleAssignSpeciality}>
        Assign Speciality
      </button>

      {error && <p className="error-message">{error}</p>}
    </div>

    <div className="table-container">
      <h3>Assigned Specialities</h3>
      <table className="speciality-table">
        <thead>
          <tr>
            <th>Speciality Name</th>
          </tr>
        </thead>
        <tbody>
          {assignedSpecialities.length > 0 ? (
            assignedSpecialities.map((speciality, index) => (
              <tr key={index}>
                <td>{speciality.name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="no-data" colSpan="1">
                No specialities assigned
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default SpecialtyTable;