import React from 'react';
import './HospitalCardList.css';

const hospitals = [
  {
    name: "El Kheir Hospital",
    address: "Algiers, Ben Aknoun",
    rating: 4.3,
  },
  {
    name: "Nouvel Espoir Clinic",
    address: "Oran, Hai El Yasmine",
    rating: 4.7,
  },
  {
    name: "Centre Médical Ibn Sina",
    address: "Constantine, Cité Daksi",
    rating: 4.1,
  },
  {
    name: "Centre Médical Ibn Sina",
    address: "Constantine, Cité Daksi",
    rating: 4.1,
  },
];

const HospitalCardList = () => {
  return (
    <div className="hospital-list-container">
      {hospitals.map((hospital, index) => (
        <div className="hospital-card" key={index}>
          <h3 className="hospital-name">{hospital.name}</h3>
          <p className="hospital-address">{hospital.address}</p>
          <p className="hospital-rating">⭐ {hospital.rating}</p>
          <button className="hospital-btn">Select</button>
        </div>
      ))}
    </div>
  );
};

export default HospitalCardList;
