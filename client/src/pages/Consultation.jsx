import React, { useState } from "react";
import { Categores } from "../components/data";
import Photo1 from "../images/clinic.png";
import Photo2 from "../images/hospital.png";
import Photo3 from "../images/medical-doctor.png";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import SideBare from "../components/SideBareClient.jsx";

const Consultation = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedState, setSelectedState] = useState("");

  const states = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", 
    "Béchar", "Blida", "Bouïra", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", 
    "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", 
    "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", 
    "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", 
    "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", 
    "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", 
    "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane"
  ];

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
          <h1>Choose a category</h1>
          <h3>See all</h3>
        </div>
        <div className="category-cards">
          {Categores.map(({ name, icon, id }) => (
            <div 
              key={id} 
              className={`category-card ${selectedCategory === name ? 'selected' : ''}`}
              onClick={() => setSelectedCategory(name)}
              style={{ cursor: 'pointer' }}
            >
              <img src={icon} alt={name} />
              <p>{name}</p>
            </div>
          ))}
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
              <p>
                <h3 style={{ color: "#0167FB", paddingBottom: "3px" }}>
                  Clinic
                </h3>
                A private clinic for routine check-ups, diagnoses, and treatments
              </p>
            </div>
            <div 
              onClick={() => setSelectedPlace('hospital')}
              style={{ cursor: 'pointer' }}
              className={selectedPlace === 'hospital' ? 'selected' : ''}
            >
              <img src={Photo2} alt="hospital" style={{ borderRadius: "13px" }} />
              <p>
                <h3 style={{ color: "#0167FB", paddingBottom: "3px" }}>
                  Hospital
                </h3>
                A large medical facility offering specialized care, surgeries.
              </p>
            </div>
            <div 
              onClick={() => setSelectedPlace('cabine')}
              style={{ cursor: 'pointer' }}
              className={selectedPlace === 'cabine' ? 'selected' : ''}
            >
              <img src={Photo3} alt="medical doctor" />
              <p>
                <h3 style={{ color: "#0167FB", paddingBottom: "3px" }}>
                  Cabinet
                </h3>
                A healthcare facility providing outpatient medical care, and treatments.
              </p>
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
