import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RadioSearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("radioSearchResults");
    const uploadedFileInfos = localStorage.getItem("uploadedRadioFileInfos");
    
    if (!stored) {
      navigate("/prescription-radio");
      return;
    }
    
    if (!uploadedFileInfos || !window.uploadedRadioFiles) {
      alert("No prescription files found. Please upload your prescription first.");
      navigate("/prescription-radio");
      return;
    }
    
    setResults(JSON.parse(stored));
  }, [navigate]);
  
  const handleBookAppointment = async (provider) => {
    setLoading(true);
    setSelectedProvider(provider);
    
    // Get user info from localStorage
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userStr || !token) {
      alert('User information not found. Please log in again.');
      navigate('/login');
      return;
    }
    
    // Parse user data
    const user = JSON.parse(userStr);
    
    try {
      // Get the uploaded files from the global window variable
      if (!window.uploadedRadioFiles || window.uploadedRadioFiles.length === 0) {
        alert("No prescription files found. Please upload your prescription first.");
        navigate("/prescription-radio");
        return;
      }
      
      // Upload each file to the server and save it as a document with type "radio prescription"
      if (!window.uploadedRadioFiles || window.uploadedRadioFiles.length === 0) {
        alert("No files found to upload. Please try again.");
        setLoading(false);
        setSelectedProvider(null);
        return;
      }
      
      let uploadSuccess = false;
      let documentId = null;
      
      for (const fileData of window.uploadedRadioFiles) {
        if (!fileData.file) {
          console.error('File object is missing for:', fileData.name);
          continue;
        }
        
        const formData = new FormData();
        
        // Use the standard document creation endpoint
        formData.append('file', fileData.file);
        formData.append('type', 'radio prescription');
        formData.append('title', `Radio Prescription - ${new Date().toLocaleDateString()}`);
        
        // Use a default client ID for testing
        formData.append('client', '6452a7d1f5b6a9c8e3d2b1a0');
        formData.append('createdBy', '6452a7d1f5b6a9c8e3d2b1a1');
        
        console.log('Uploading file:', fileData.name);
        
        try {
          // Log the FormData (for debugging)
          for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
          }
          
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/v1/documents`, 
            formData,
            { 
              headers: { 'Content-Type': 'multipart/form-data' }
            }
          );
          
          console.log('Upload successful:', response.data);
          uploadSuccess = true;
          
          // Extract document ID from the response
          if (response.data && response.data.data && response.data.data._id) {
            documentId = response.data.data._id;
          } else if (response.data && response.data.document && response.data.document._id) {
            documentId = response.data.document._id;
          }
        } catch (uploadError) {
          console.error('Error uploading file:', uploadError);
          console.error('Error details:', uploadError.response?.data || 'No response data');
          alert(`Error uploading file ${fileData.name}: ${uploadError.response?.data?.message || uploadError.message}`);
          // Continue with the next file instead of stopping completely
        }
      }
      
      // If no files were uploaded successfully, don't proceed with appointment creation
      if (!uploadSuccess) {
        alert("Failed to upload any files. Please try again.");
        setLoading(false);
        setSelectedProvider(null);
        return;
      }
      
      // Check if we have a document ID
      if (!documentId) {
        alert("Document ID not found in the response. Please try again.");
        setLoading(false);
        setSelectedProvider(null);
        return;
      }
      
      // Create an appointment with the service provider
      const appointmentRequest = {
        serviceProviderId: provider._id,
        clientId: user._id, // Add the client ID from the user object
        appointmentType: 'radio',
        documentId: documentId, // Add the document ID
        notes: 'Radio prescription appointment'
      };
      
      console.log('Creating appointment with data:', appointmentRequest);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/appointments`, 
        appointmentRequest,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Store appointment info and navigate to ticket page
      const appointmentData = response.data.data;
      localStorage.setItem("radioAppointment", JSON.stringify(appointmentData));
      localStorage.removeItem("uploadedRadioFileInfos"); // Clear the file infos from storage after successful upload
      delete window.uploadedRadioFiles; // Clear the global variable
      
      // Navigate to the ticket page with the appointment ID
      navigate(`/radio/radio-ticket/${appointmentData._id}`);
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert(error.response?.data?.message || "Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
      setSelectedProvider(null);
    }
  };

  return (
    <section className="prescription-page">
      <div className="prescription-container">
        <h1 className="main-title">Radio Prescription Search Results</h1>
        {results.length === 0 ? (
          <div className="no-results-message" style={{textAlign: 'center', marginTop: '2rem', color: '#888'}}>
            No service providers found for your selection.
          </div>
        ) : (
          <div className="search-results-container">
            <h2>Results</h2>
            <div className="search-results">
              {results.map((provider) => (
                <div className="provider-card" key={provider._id}>
                  <div className="provider-type">{provider.type}</div>
                  <div className="provider-name">{provider.name}</div>
                  <div className="provider-details">
                    <p><strong>Wilaya:</strong> {provider.wilaya}</p>
                    <p><strong>Email:</strong> {provider.email}</p>
                    <p><strong>Specialities:</strong> {Array.isArray(provider.specialities) ? provider.specialities.map(s => s.name || s).join(', ') : ''}</p>
                  </div>
                  <button 
                    className="book-appointment-btn" 
                    onClick={() => handleBookAppointment(provider)}
                    disabled={loading && selectedProvider?._id === provider._id}
                  >
                    {loading && selectedProvider?._id === provider._id ? 'Processing...' : 'Book Appointment'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RadioSearchResults; 