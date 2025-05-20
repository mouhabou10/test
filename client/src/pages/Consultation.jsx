import React, { useState, useEffect } from "react";
import axios from "axios";
import Photo1 from "../images/clinic.png";
import Photo2 from "../images/hospital.png";
import Photo3 from "../images/medical-doctor.png";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import SideBare from "../components/SideBareClient.jsx";

// Import specialty images
import DentistryIcon from "../images/spicialites/dentistry.png";
import EmergencyMedicineIcon from "../images/spicialites/Emergency Medicine.png";
import EndocrinologyIcon from "../images/spicialites/endocrinology.png";
import KidneyIcon from "../images/spicialites/kidney.png";
import NeurologyIcon from "../images/spicialites/neurology.png";
import OphthalmologyIcon from "../images/spicialites/ophthalmology.png";
import PediatricsIcon from "../images/spicialites/pediatrics.png";
import RheumatologyIcon from "../images/spicialites/rheumatology.png";

const Consultation = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [specialities, setSpecialities] = useState([]);
  const [loadingSpecialities, setLoadingSpecialities] = useState(true);
  const [specialitiesError, setSpecialitiesError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const states = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", 
    "Béchar", "Blida", "Bouïra", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", 
    "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", 
    "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", 
    "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", 
    "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", 
    "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", 
    "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane"
  ];

  // Map specialty names to their respective images
  const specialtyImageMap = {
    'Dentistry': DentistryIcon,
    'Emergency Medicine': EmergencyMedicineIcon,
    'Endocrinology': EndocrinologyIcon,
    'Urology': KidneyIcon,
    'Neurology': NeurologyIcon,
    'Ophthalmology': OphthalmologyIcon,
    'Pediatrics': PediatricsIcon,
    'Rheumatology': RheumatologyIcon,
  };
  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        setLoadingSpecialities(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/services`);
        
        if (response.data?.success) {
          const validSpecialties = response.data.data.filter(specialty => 
            specialtyImageMap.hasOwnProperty(specialty.name)
          );
          setSpecialities(validSpecialties);
          setSpecialitiesError(null);
        } else {
          console.error('Invalid response format:', response.data);
          setSpecialitiesError("Error loading specialties");
        }
      } catch (err) {
        console.error('Error fetching specialities:', err);
        setSpecialitiesError(
          err.response?.status === 404 ? "No specialties found" :
          "Failed to load specialties. Please try again later."
        );
      } finally {
        setLoadingSpecialities(false);
      }
    };
    fetchSpecialities();
  }, []);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
  };

  const handleSearch = () => {
    setLoading(true);
    setError("");

    // Validate required fields
    if (!selectedCategory) {
      setError("Please select a specialty");
      setLoading(false);
      return;
    }

    if (!selectedPlace) {
      setError("Please select a place type");
      setLoading(false);
      return;
    }

    if (!selectedState) {
      setError("Please select a state");
      setLoading(false);
      return;
    }

    // Store search parameters in localStorage
    const searchParams = {
      category: selectedCategory,
      place: selectedPlace,
      state: selectedState
    };

    localStorage.setItem('consultationSearchParams', JSON.stringify(searchParams));
    
    // Navigate to search results page
    navigate('/consultation/search');
  };

  return (
    <section>
      <SideBare/>
      <Header/>
      <div className="main-container">
        {/* Specialty Selection */}
        <div className="specialty-section">
          <h2 className="section-title">Choose a Specialty</h2>
          <div className="category-container" style={{ margin: 0 }}>
          <div className="category-title">
            <h1>Choose a speciality for operation</h1>
            <h3>See all</h3>
          </div>
          <div className="category-cards">
            {loadingSpecialities ? (
              <div className="loading-spinner"></div>
            ) : specialitiesError ? (
              <div className="error-message">{specialitiesError}</div>
            ) : (
              specialities.map(({ name, _id }) => {
                const icon = specialtyImageMap[name];
                return (
                  <div 
                    key={_id} 
                    className={`category-card ${selectedCategory === name ? 'selected' : ''}`}
                    onClick={() => handleCategorySelect(name)}
                    style={{
                      border: selectedCategory === name ? '2px solid #0052E0' : 'none',
                      cursor: 'pointer',
                      backgroundColor: selectedCategory === name ? '#f0f7ff' : 'white'
                    }}
                  >
                    {icon ? (
                      <img src={icon} alt={name} style={{ width: '48px', height: '48px', marginBottom: '8px' }} />
                    ) : (
                      <div 
                        style={{ 
                          width: '48px', 
                          height: '48px', 
                          marginBottom: 8,
                          background: '#0167FB',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '24px'
                        }}
                      >
                        {name.charAt(0)}
                      </div>
                    )}
                    <p>{name}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
        </div>

        {/* State Selection */}
        <div className="state-section">
          <h2 className="section-title">Choose a State</h2>
          <div className="state-container">
            <select
              className="state-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">Select a state</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Place Type */}
        <div className="place-section">
          <h2 className="section-title">Choose Type</h2>
          <div className="place-type">
            <div
              className={`place-card${selectedPlace === 'clinic' ? ' selected' : ''}`}
              onClick={() => handlePlaceSelect('clinic')}
            >
              <img src={Photo1} alt="Clinic" className="place-image" />
              <p className="place-name">Clinic</p>
            </div>
            <div
              className={`place-card${selectedPlace === 'hospital' ? ' selected' : ''}`}
              onClick={() => handlePlaceSelect('hospital')}
            >
              <img src={Photo2} alt="Hospital" className="place-image" />
              <p className="place-name">Hospital</p>
            </div>
            <div
              className={`place-card${selectedPlace === 'cabine' ? ' selected' : ''}`}
              onClick={() => handlePlaceSelect('cabine')}
            >
              <img src={Photo3} alt="Cabinet" className="place-image" />
              <p className="place-name">Cabinet</p>
            </div>
          </div>
        </div>

        {/* Search Container */}
        <div className="search-container">
          <button 
            className="search-btn" 
            onClick={handleSearch} 
            disabled={loading || !selectedCategory || !selectedPlace || !selectedState}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </section>
  );
};

export default Consultation;
