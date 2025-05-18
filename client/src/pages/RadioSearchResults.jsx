import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RadioSearchResults = () => {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("radioSearchResults");
    if (stored) {
      setResults(JSON.parse(stored));
    } else {
      navigate("/prescription-radio");
    }
  }, [navigate]);

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