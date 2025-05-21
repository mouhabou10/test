import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../components/Header.jsx";
import SideBare from "../components/SideBareClient.jsx";

const ConsultationSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchParams, setSearchParams] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get search parameters from localStorage
    const params = localStorage.getItem('consultationSearchParams');
    if (params) {
      try {
        const parsedParams = JSON.parse(params);
        setSearchParams(parsedParams);
        
        const fetchServiceProviders = async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              setError('Please log in to continue');
              navigate('/login', { state: { from: location.pathname } });
              return;
            }

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/service-provider/search`, {
              params: {
                speciality: parsedParams.category,
                type: parsedParams.place,
                wilaya: parsedParams.state
              },
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
        
        if (response.data?.success) {
          setProviders(response.data.data);
          setError(null);
        } else {
          setError('Failed to fetch service providers');
          setProviders([]);
        }
      } catch (err) {
        console.error('Error fetching service providers:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setError('Session expired. Please log in again.');
          setTimeout(() => {
            navigate('/login', { state: { from: location.pathname + location.search } });
          }, 2000);
        } else {
          setError('Error loading service providers. Please try again.');
        }
        setProviders([]);
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
  }, [navigate, location]);

  const handleBookAppointment = (providerId) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      setError('Please log in to book an appointment');
      navigate('/login', { state: { from: `/consultation/ticket/${providerId}` } });
      return;
    }

    navigate(`/consultation/ticket/${providerId}`);
  };

  return (
    <section>
      <Header />
      <SideBare />
      <div className="search-results-container">
        <h1>Search Results</h1>
        {searchParams && (
          <div className="search-filters">
            <p><strong>Specialty:</strong> {searchParams.category}</p>
            <p><strong>Place Type:</strong> {searchParams.place}</p>
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
          ) : providers.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#666' }}>
              No service providers found matching your criteria.
            </div>
          ) : (
            providers.map((provider) => (
              <div key={provider._id} className="provider-card">
                <div className="provider-type">{provider.type}</div>
                <h3 className="provider-name">{provider.name}</h3>
                <div className="provider-details">
                  <p><strong>Email:</strong> {provider.email}</p>
                  <p><strong>Location:</strong> {provider.wilaya}</p>
                  <p><strong>Specialty:</strong> {
                    provider.type === 'cabine' 
                      ? (provider.speciality?.name || provider.speciality)
                      : (Array.isArray(provider.specialities) 
                          ? provider.specialities.map(s => s.name || s).join(', ') 
                          : provider.specialities?.name || provider.specialities || 'Not provided')
                  }</p>
                </div>
                <button 
                  className="book-appointment-btn"
                  onClick={() => handleBookAppointment(provider._id)}
                >
                  Book Appointment
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ConsultationSearch;
