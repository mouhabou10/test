import React from "react";
import avatar1 from "../images/medical-check.png";
import avatar2 from "../images/ticket.png";
import avatar3 from "../images/file.png";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx"
import SideBareClient from "../components/SideBareClient.jsx"
const Labo = () => {
  return (
    <section
      style={{ marginLeft: "16%", marginRight: "%", marginTop: "40px" }}
    >
       <SideBareClient/>
       <Header/>
      <h1 style={{ color: "#0052E0", paddingLeft: "10px" }}>
        Laboratory Services
      </h1>
      <div className="labo-container">
        <div className="prescription">
          <img src={avatar3} alt="error" />
          <div>
            <Link to="/labo/priscription-labo">
              <h3 style={{ color: "#0167FB" }}>prescription checkup</h3>
            </Link>
            <p style={{ marginTop: "1%" }}>
              A private clinic for routine check-ups, diagnoses, and treatments
            </p>
          </div>
        </div>
        <div className="ticket">
          <img src={avatar2} alt="error" />

          <div>
            <Link to="/labo/labo-ticket/123">
              <h3 style={{ color: "#0167FB" }}>ticket</h3>
            </Link>
            <p style={{ marginTop: "1%" }}>
              A private clinic for routine check-ups, diagnoses, and treatments
            </p>
          </div>
        </div>
        <div className="result">
          <img src={avatar1} alt="error" />

          <div>
            <h3 style={{ color: "#0167FB" }}>result</h3>
            <p style={{ marginTop: "1%" }}>
              A private clinic for routine check-ups, diagnoses, and treatments
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Labo;
