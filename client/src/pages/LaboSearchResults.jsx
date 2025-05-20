import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LaboSearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("laboSearchResults");
    const uploadedFileInfos = localStorage.getItem("uploadedLaboFileInfos");
    
    if (!stored) {
      navigate("/labo/priscription-labo");
      return;
    }
    
    if (!uploadedFileInfos || !window.uploadedLaboFiles) {
      alert("No prescription files found. Please upload your prescription first.");
      navigate("/labo/priscription-labo");
      return;
    }
    
    setResults(JSON.parse(stored));
  }, [navigate]);
  
  const handleBookAppointment = async (provider) => {
    setLoading(true);
    setSelectedProvider(provider);
    
    try {
      // Get the uploaded files from the global window variable
      if (!window.uploadedLaboFiles || window.uploadedLaboFiles.length === 0) {
        alert("No prescription files found. Please upload your prescription first.");
        navigate("/labo/priscription-labo");
        return;
      }
      
      // Upload each file to the server and save it as a document with type "labo prescription"
      if (!window.uploadedLaboFiles || window.uploadedLaboFiles.length === 0) {
        alert("No files found to upload. Please try again.");
        setLoading(false);
        setSelectedProvider(null);
        return;
      }
      
      let uploadSuccess = false;
      
      for (const fileData of window.uploadedLaboFiles) {
        if (!fileData.file) {
          console.error('File object is missing for:', fileData.name);
          continue;
        }
        
        const formData = new FormData();
        
        // Use the standard document creation endpoint
        formData.append('file', fileData.file);
        formData.append('type', 'labo prescription');
        formData.append('title', `Lab Prescription - ${new Date().toLocaleDateString()}`);
        
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
      
      // Create an appointment with the service provider
      const appointmentRequest = {
        serviceProviderId: provider._id,
        appointmentType: 'labo',
        notes: 'Lab prescription appointment'
      };
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/appointments`, 
        appointmentRequest
      );
      
      // Store appointment info and navigate to ticket page
      const appointmentData = response.data.data;
      localStorage.setItem("laboAppointment", JSON.stringify(appointmentData));
      localStorage.removeItem("uploadedLaboFileInfos"); // Clear the file infos from storage after successful upload
      delete window.uploadedLaboFiles; // Clear the global variable
      
      // Navigate to the ticket page with the appointment ID
      navigate(`/labo/labo-ticket/${appointmentData._id}`);
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
        <h1 className="main-title">Lab Prescription Search Results</h1>
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

export default LaboSearchResults;
