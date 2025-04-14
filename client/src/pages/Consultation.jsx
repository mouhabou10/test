import React, { useState } from "react";
import { Categores } from "../components/data";
import Photo1 from "../images/clinic.png";
import Photo2 from "../images/hospital.png";
import Photo3 from "../images/medical-doctor.png";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import SideBare from "../components/SideBareClient.jsx";


const Consultation = () => {
  const [category, setCategory] = useState(Categores);

  return (
    <section>
     <Header/>
     <SideBare/>
      <div className="category-container">
        <div className="category-title">
          <h1>shoose a category</h1>
          <h3>See all</h3>
        </div>
        <div className="category-cards">
          {category.map(({ name, icon, id }) => (
            <div key={id} className="category-card">
              <img src={icon} alt={name} />
              <p>{name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="second-part">
        <div className="placeType">
          <h1 style={{ color: "#0052E0" }}>shoose place</h1>
          <div className="placeType-container">
            <div>
              <img src={Photo1} alt="clinic" style={{ borderRadius: "13px" }} />
              <p>
                <h3 style={{ color: "#0167FB", paddingBottom: "3px" }}>
                  clinic
                </h3>
                A private clinic for routine check-ups, diagnoses, and
                treatments{" "}
              </p>
            </div>
            <div>
              <img
                src={Photo2}
                alt="hospital"
                style={{ borderRadius: "13px" }}
              />
              <p>
                <h3 style={{ color: "#0167FB", paddingBottom: "3px" }}>
                  Hospital
                </h3>
                A large medical facility offering specialized care, surgeries.{" "}
              </p>
            </div>
            <div>
              <img src={Photo3} alt="medical doctor" />
              <p>
                <h3 style={{ color: "#0167FB", paddingBottom: "3px" }}>
                  cabine
                </h3>{" "}
                A healthcare facility providing outpatient medical care, and
                treatments.{" "}
              </p>
            </div>
          </div>
        </div>
        <div className="rightSide">
          <div className="State">
            <h1 style={{ color: "#0052E0" }}>shoose a State</h1>
            <div className="State-container">
              <select>
                <option value="state1">state1</option>
                <option value="state2">state2</option>
                <option value="state3">state3</option>
                <option value="state4">state4</option>
              </select>
            </div>
          </div>
          <div className="advises">
            <div className="advice-container">
              <h1 style={{ color: "#0052E0" }}>Health advice :</h1>
              <p>
              Stay hydrated, exercise daily, and get enough rest.
              Good sleep and a balanced diet keep you healthy! 
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <Link to={'/consultation/search'}>
          <button className="search-btn">Search</button>
        </Link>
      </div>
    </section>
  );
};

export default Consultation;
