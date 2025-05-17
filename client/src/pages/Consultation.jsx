import React, { useState, useEffect } from "react";
import axios from "axios";
import Photo1 from "../images/clinic.png";
import Photo2 from "../images/hospital.png";
import Photo3 from "../images/medical-doctor.png";
import { Link } from "react-router-dom";
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

  const handleSearch = () => {
    // We'll use the search query parameters to pass the selected values
    const searchParams = new URLSearchParams();
    if (selectedCategory) searchParams.append("category", selectedCategory);
    if (selectedPlace) searchParams.append("place", selectedPlace);
    if (selectedState) searchParams.append("state", selectedState);
    
    return `/consultation/search?${searchParams.toString()}`;
  };

  return (
    <section>
      <Header/>
      <SideBare/>
      <div className="category-container">
        <div className="category-title">
          <h1>Choose a speciality</h1>
          <h3>See all</h3>
        </div>
        <div className="category-cards">
          {loadingSpecialities ? (
            <div>Loading specialities...</div>
          ) : specialitiesError ? (
            <div className="text-red-500">{specialitiesError}</div>
          ) : (
            specialities.map(({ _id, name }) => {
              const specialtyImage = specialtyImageMap[name];
              return (
                <div
                  key={_id}
                  className={`category-card ${selectedCategory === name ? 'selected' : ''}`}
                  onClick={() => setSelectedCategory(name)}
                  style={{ cursor: 'pointer' }}
                >
                  {specialtyImage ? (
                    <img 
                      src={specialtyImage} 
                      alt={name}
                      style={{ width: '48px', height: '48px', marginBottom: 8 }}
                    />
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
      <div className="second-part">
        <div className="placeType">
          <h1 style={{ color: "#0052E0" }}>Choose place</h1>
          <div className="placeType-container">
            <div 
              onClick={() => setSelectedPlace('clinic')}
              style={{ cursor: 'pointer' }}
              className={selectedPlace === 'clinic' ? 'selected' : ''}
            >
              <img src={Photo1} alt="clinic" style={{ borderRadius: "13px" }} />
              <div className="place-info">
                <h3 style={{ color: "#0167FB", paddingBottom: "3px" }}>
                  Clinic
                </h3>
                <span>A private clinic for routine check-ups, diagnoses, and treatments</span>
              </div>
            </div>
            <div 
              onClick={() => setSelectedPlace('hospital')}
              style={{ cursor: 'pointer' }}
              className={selectedPlace === 'hospital' ? 'selected' : ''}
            >
              <img src={Photo2} alt="hospital" style={{ borderRadius: "13px" }} />
              <div className="place-info">
                <h3 style={{ color: "#0167FB", paddingBottom: "3px" }}>
                  Hospital
                </h3>
                <span>A large medical facility offering specialized care, surgeries.</span>
              </div>
            </div>
            <div 
              onClick={() => setSelectedPlace('cabine')}
              style={{ cursor: 'pointer' }}
              className={selectedPlace === 'cabine' ? 'selected' : ''}
            >
              <img src={Photo3} alt="medical doctor" />
              <div className="place-info">
                <h3 style={{ color: "#0167FB", paddingBottom: "3px" }}>
                  Cabinet
                </h3>
                <span>A healthcare facility providing outpatient medical care, and treatments.</span>
              </div>
            </div>
          </div>
        </div>
        <div className="rightSide">
          <div className="State">
            <h1 style={{ color: "#0052E0" }}>Choose a State</h1>
            <div className="State-container">
              <select 
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
          <div className="advises">
            <div className="advice-container">
              <h1 style={{ color: "#0052E0" }}>Health advice:</h1>
              <p>
                Stay hydrated, exercise daily, and get enough rest.
                Good sleep and a balanced diet keep you healthy! 
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <Link to={handleSearch()}>
          <button 
            className="search-btn"
            disabled={!selectedCategory || !selectedPlace || !selectedState}
          >
            Search
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Consultation;
