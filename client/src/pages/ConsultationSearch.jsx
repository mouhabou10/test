import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from "../components/Header.jsx";
import SideBare from "../components/SideBareClient.jsx";

const ConsultationSearch = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category');
  const place = searchParams.get('place');
  const state = searchParams.get('state');
  
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceProviders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/service-provider/search`, {
          params: {
            speciality: category,
            type: place,
            wilaya: state
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
        setError('Error loading service providers. Please try again.');
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceProviders();
  }, [category, place, state]);

  return (
    <section>
      <Header />
      <SideBare />      <div className="search-results-container">
        <h1>Search Results</h1>
        <div className="search-filters">
          <p><strong>Specialty:</strong> {category}</p>
          <p><strong>Place Type:</strong> {place}</p>
          <p><strong>State:</strong> {state}</p>
        </div>
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
                      ? provider.speciality 
                      : provider.specialities?.join(', ')
                  }</p>
                </div>                <button 
                  className="book-appointment-btn"
                  onClick={() => window.location.href = `/consultation/ticket/${provider._id}`}
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
