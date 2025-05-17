import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ConsultationResults = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const clientChoices = location.state?.clientChoices;

  useEffect(() => {
    const fetchServiceProviders = async () => {
      try {
        setLoading(true);
        // Use the correct backend route (singular)
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/service-provider/search`, {
          params: clientChoices
        });
        // The backend returns { success, count, data }
        setServiceProviders(response.data.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch service providers. Please try again later.');
        console.error('Error fetching service providers:', err);
      } finally {
        setLoading(false);
      }
    };

    if (clientChoices) {
      fetchServiceProviders();
    } else {
      setError('No search criteria provided');
      setLoading(false);
    }
  }, [clientChoices]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-semibold mb-6">Available Service Providers</h1>
      
      {serviceProviders.length === 0 ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          No service providers found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceProviders.map((provider) => (
            <div 
              key={provider._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{provider.name}</h2>
                <p className="text-gray-600 mb-2">{provider.specialty}</p>
                <div className="text-sm text-gray-500">
                  <p>📍 {provider.location}</p>
                  <p>📞 {provider.phoneNumber}</p>
                  {provider.email && <p>✉️ {provider.email}</p>}
                </div>
                <div className="mt-4">
                  <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    onClick={() => {/* TODO: Add booking functionality */}}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultationResults;