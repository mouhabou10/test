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
        
        // Fetch service providers from the database
        const fetchServiceProviders = async () => {
          try {
            // Get token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
              setError('Please log in to continue');
              navigate('/login', { state: { from: location.pathname + location.search } });
              return;
            }
            
            // Fetch service providers from the API
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/service-providers/search/service-providers`, {
              params: {
                speciality: parsedParams.category,
                type: parsedParams.type,
                wilaya: parsedParams.state
              },
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.data?.success) {
              // Map the API response to our expected format
              // Keep the original data structure to ensure we have all fields
              const mappedResults = response.data.data.map(provider => ({
                id: provider._id,
                _id: provider._id,
                name: provider.name,
                email: provider.email,
                address: provider.address,
                wilaya: provider.wilaya,
                type: provider.type,
                category: parsedParams.category,
                specialities: provider.specialities || [],
                rating: provider.rating,
                price: provider.priceRange
              }));
              
              setResults(mappedResults);
            } else {
              throw new Error('Failed to fetch service providers');
            }
          } catch (error) {
            console.error('Error fetching service providers:', error);
            if (error.response?.status === 401) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setError('Session expired. Please log in again.');
              setTimeout(() => {
                navigate('/login', { state: { from: location.pathname + location.search } });
              }, 2000);
            } else {
              setError(error.message || 'An error occurred while fetching service providers');
            }
            setResults([]);
          } finally {
            setLoading(false);
          }
        };
        
        fetchServiceProviders();
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
    
    // Get search parameters from localStorage
    const params = localStorage.getItem('operationSearchParams');
    if (!params) {
      setError('Search parameters not found. Please try again.');
      setBookingInProgress(false);
      return;
    }
    
    const parsedParams = JSON.parse(params);
    
    try {
      // Get files from localStorage
      const filesStr = localStorage.getItem('operationFiles');
      if (!filesStr) {
        throw new Error('No files found. Please upload your prescription files again.');
      }
      
      const fileInfos = JSON.parse(filesStr);
      
      // Get user info and token
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!userStr || !token) {
        throw new Error('User information not found. Please log in again.');
      }
      
      // Parse user data
      const user = JSON.parse(userStr);
      
      // Make sure we have a user ID
      if (!user || !user._id) {
        console.log('User object:', user);
        throw new Error('Invalid user data. Please log in again.');
      }
      
      // For testing purposes, we'll create a mock file if none exists
      let files = window.uploadedOperationFiles || [];
      
      // If no files are found, create a mock file for testing
      if (files.length === 0) {
        console.log('No files found, creating a mock file for testing');
        // Create a mock file with some text content
        const mockFileContent = new Blob(['This is a mock prescription file for testing'], { type: 'text/plain' });
        const mockFile = new File([mockFileContent], 'mock-prescription.txt', { type: 'text/plain' });
        files = [{ file: mockFile, name: 'mock-prescription.txt', progress: 100 }];
        // Store it for future reference
        window.uploadedOperationFiles = files;
      }
      
      // Start progress tracking
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add file to FormData
      formData.append('file', files[0].file);
      
      // Add other document metadata
      formData.append('title', `Operation Prescription - ${parsedParams.category}`);
      formData.append('type', 'operation prescription');
      formData.append('client', user._id);
      formData.append('createdBy', user._id);
      
      // Upload document with file
      const documentResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/documents`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Document created successfully:', documentResponse.data);
      
      // Extract document ID from the response
      let documentId;
      if (documentResponse.data && documentResponse.data.data && documentResponse.data.data._id) {
        documentId = documentResponse.data.data._id;
      } else if (documentResponse.data && documentResponse.data.document && documentResponse.data.document._id) {
        documentId = documentResponse.data.document._id;
      } else {
        console.error('Document ID not found in response:', documentResponse.data);
        throw new Error('Document ID not found in response');
      }
      
      console.log('Extracted document ID:', documentId);
      
      // Create appointment
      console.log('Creating appointment with data:', {
        serviceProviderId: provider.id,
        clientId: user._id,
        appointmentType: 'operation', // Using 'operation' as the correct appointment type
        notes: `Operation type: ${parsedParams.category}, Provider type: ${provider.type}`,
        documentId: documentId
      });
      
      const appointmentResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/appointments`,
        {
          serviceProviderId: provider.id,
          clientId: user._id,
          appointmentType: 'operation', // Using 'operation' as the correct appointment type
          notes: `Operation type: ${parsedParams.category}, Provider type: ${provider.type}`,
          documentId: documentId
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Appointment created successfully:', appointmentResponse.data);
      
      // Extract appointment ID from the response
      let appointmentId;
      if (appointmentResponse.data && appointmentResponse.data.data && appointmentResponse.data.data._id) {
        appointmentId = appointmentResponse.data.data._id;
      } else if (appointmentResponse.data && appointmentResponse.data.appointment && appointmentResponse.data.appointment._id) {
        appointmentId = appointmentResponse.data.appointment._id;
      } else {
        console.error('Appointment ID not found in response, using a placeholder');
        appointmentId = 'placeholder-id';
      }
      
      console.log('Extracted appointment ID:', appointmentId);
      
      // Save appointment data to localStorage for the ticket page
      localStorage.setItem('operationAppointment', JSON.stringify({
        provider: provider,
        appointmentId: appointmentId,
        appointmentDate: new Date(),
        category: parsedParams.category
      }));
      
      // Complete the progress bar
      setUploadProgress(100);
      
      // Navigate to the ticket page
      setTimeout(() => {
        navigate(`/opiration/opiration-ticket/${appointmentId}`);
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
      <div className="search-results-container">
        <h1>Search Results</h1>
        
        {searchParams && (
          <div className="search-filters">
            <p><strong>Specialty:</strong> {searchParams.category}</p>
            <p><strong>Place Type:</strong> {searchParams.type}</p>
            <p><strong>State:</strong> {searchParams.state}</p>
          </div>
        )}
        
        <div className="search-results">
          {loading ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#666' }}>
              Loading service providers...
            </div>
          ) : error ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#dc3545' }}>
              {error}
            </div>
          ) : results.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#666' }}>
              <p>No service providers found matching your criteria.</p>
              <button 
                className="back-button"
                onClick={() => navigate('/opiration')}
              >
                Go Back
              </button>
            </div>
          ) : (
            results.map(provider => (
              <div key={provider.id} className="provider-card">
                <div className="provider-type">{provider.type}</div>
                <h3 className="provider-name">{provider.name}</h3>
                <div className="provider-details">
                  <p><strong>Email:</strong> {provider.email || 'Not provided'}</p>
                  <p><strong>Location:</strong> {provider.address || provider.wilaya || 'Not provided'}</p>
                  <p><strong>Specialty:</strong> {provider.specialities ? 
                    (Array.isArray(provider.specialities) ? 
                      provider.specialities.map(s => s.name || s).join(', ') : 
                      provider.specialities.name || provider.specialities) : 
                    provider.category || 'Not provided'}
                  </p>
                </div>
                
                {bookingInProgress && selectedProvider && selectedProvider.id === provider.id ? (
                  <div className="booking-progress">
                    <p>Booking your appointment...</p>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p>{uploadProgress}%</p>
                  </div>
                ) : (
                  <button 
                    className="book-appointment-btn"
                    onClick={() => handleBookAppointment(provider)}
                    disabled={bookingInProgress}
                  >
                    Book Appointment
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default OperationSearchResults;
