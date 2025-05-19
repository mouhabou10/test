import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideBareClient from '../components/SideBareClient';
import Header from '../components/Header';

const OperationSearchResults = () => {
  const [searchParams, setSearchParams] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Get search parameters from localStorage
    const params = localStorage.getItem('operationSearchParams');
    if (params) {
      try {
        const parsedParams = JSON.parse(params);
        setSearchParams(parsedParams);
        
        // Simulate fetching results from API
        setTimeout(() => {
          // Mock data - in a real app, this would come from an API
          const mockResults = [
            {
              id: '1',
              name: 'Central Hospital',
              address: `${parsedParams.state}, Main Street 123`,
              type: parsedParams.type,
              category: parsedParams.category,
              rating: 4.5,
              price: '$100-150',
              image: 'https://via.placeholder.com/150'
            },
            {
              id: '2',
              name: 'City Medical Center',
              address: `${parsedParams.state}, Health Avenue 456`,
              type: parsedParams.type,
              category: parsedParams.category,
              rating: 4.2,
              price: '$80-120',
              image: 'https://via.placeholder.com/150'
            },
            {
              id: '3',
              name: 'Specialized Surgery Clinic',
              address: `${parsedParams.state}, Doctor's Lane 789`,
              type: parsedParams.type,
              category: parsedParams.category,
              rating: 4.8,
              price: '$150-200',
              image: 'https://via.placeholder.com/150'
            }
          ];
          
          setResults(mockResults);
          setLoading(false);
        }, 1500);
      } catch (e) {
        console.error('Error parsing search parameters:', e);
        setError('Invalid search parameters. Please try again.');
        setLoading(false);
      }
    } else {
      setError('No search parameters found. Please go back and search again.');
      setLoading(false);
    }
  }, []);

  const handleBookAppointment = async (provider) => {
    setSelectedProvider(provider);
    setBookingInProgress(true);
    setUploadProgress(0);
    
    try {
      // Get files from localStorage
      const filesStr = localStorage.getItem('operationFiles');
      if (!filesStr) {
        throw new Error('No files found. Please upload your prescription files again.');
      }
      
      const fileInfos = JSON.parse(filesStr);
      
      // Get user info
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('User information not found. Please log in again.');
      }
      
      const user = JSON.parse(userStr);
      
      // Simulate file upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Create document in the database
      // In a real app, you would upload the actual files here
      const documentResponse = await axios.post('/api/v1/documents', {
        title: `Operation Prescription - ${searchParams.category}`,
        type: 'operation prescription',
        client: user._id,
        createdBy: user._id
      });
      
      // Create appointment
      const appointmentResponse = await axios.post('/api/v1/appointments', {
        serviceProviderId: provider.id,
        clientId: user._id,
        appointmentType: 'operation',
        notes: `Operation type: ${searchParams.category}, Provider type: ${provider.type}`,
        documentId: documentResponse.data.document._id
      });
      
      // Save appointment data to localStorage for the ticket page
      localStorage.setItem('operationAppointment', JSON.stringify({
        provider: provider,
        appointmentId: appointmentResponse.data.appointment._id,
        appointmentDate: new Date(),
        category: searchParams.category
      }));
      
      // Complete the progress bar
      setUploadProgress(100);
      
      // Navigate to the ticket page
      setTimeout(() => {
        navigate(`/opiration/opiration-ticket/${appointmentResponse.data.appointment._id}`);
      }, 500);
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      setError(error.message || 'Failed to book appointment. Please try again.');
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return (
      <section>
        <SideBareClient />
        <Header />
        <div style={{ marginLeft: "20%", marginTop: "50px", textAlign: "center" }}>
          <h2>Loading search results...</h2>
          <div className="loading-spinner"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <SideBareClient />
        <Header />
        <div style={{ marginLeft: "20%", marginTop: "50px", textAlign: "center" }}>
          <h2 style={{ color: "red" }}>Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/opiration')}
            style={{ 
              padding: "10px 20px", 
              backgroundColor: "#0052E0", 
              color: "white", 
              border: "none", 
              borderRadius: "5px", 
              cursor: "pointer",
              marginTop: "20px"
            }}
          >
            Go Back
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <SideBareClient />
      <Header />
      <div style={{ marginLeft: "20%", padding: "20px" }}>
        <h1 style={{ color: "#0052E0" }}>Search Results</h1>
        
        {searchParams && (
          <div style={{ marginBottom: "20px" }}>
            <p><strong>Location:</strong> {searchParams.state}</p>
            <p><strong>Provider Type:</strong> {searchParams.type}</p>
            <p><strong>Category:</strong> {searchParams.category}</p>
          </div>
        )}
        
        {results.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>No results found</h2>
            <p>Please try different search criteria</p>
            <button 
              onClick={() => navigate('/opiration')}
              style={{ 
                padding: "10px 20px", 
                backgroundColor: "#0052E0", 
                color: "white", 
                border: "none", 
                borderRadius: "5px", 
                cursor: "pointer",
                marginTop: "20px"
              }}
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="results-container">
            {results.map(provider => (
              <div 
                key={provider.id} 
                className="result-card"
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                <div className="provider-info" style={{ flex: "1" }}>
                  <h3 style={{ color: "#0052E0", marginBottom: "10px" }}>{provider.name}</h3>
                  <p><strong>Address:</strong> {provider.address}</p>
                  <p><strong>Type:</strong> {provider.type}</p>
                  <p><strong>Category:</strong> {provider.category}</p>
                  <p><strong>Rating:</strong> {provider.rating}/5</p>
                  <p><strong>Price Range:</strong> {provider.price}</p>
                </div>
                
                <div className="booking-section" style={{ marginLeft: "20px" }}>
                  {bookingInProgress && selectedProvider && selectedProvider.id === provider.id ? (
                    <div className="booking-progress">
                      <p>Booking your appointment...</p>
                      <div style={{ 
                        width: "100%", 
                        backgroundColor: "#e0e0e0", 
                        borderRadius: "5px", 
                        marginTop: "10px" 
                      }}>
                        <div style={{ 
                          width: `${uploadProgress}%`, 
                          backgroundColor: "#0052E0", 
                          height: "10px", 
                          borderRadius: "5px",
                          transition: "width 0.3s ease-in-out"
                        }}></div>
                      </div>
                      <p>{uploadProgress}%</p>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleBookAppointment(provider)}
                      style={{ 
                        padding: "10px 20px", 
                        backgroundColor: "#0052E0", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "5px", 
                        cursor: "pointer" 
                      }}
                      disabled={bookingInProgress}
                    >
                      Book Appointment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OperationSearchResults;
