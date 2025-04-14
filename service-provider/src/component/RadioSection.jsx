import React from "react";
import { Link } from "react-router-dom";
import "./OperationSection.css";
import radioImage from "../assets/radio.jpg";

const RadioSection = () => {
  return (
    <div className="operation-section">
      {/* النص أولاً */}
      <div className="operation-content">
        <h3 className="operation-title">
          Operation <span className="operation-highlight">Consultation</span> section
        </h3>
        <h2 className="operation-priority">
          Your <span className="operation-highlight">health</span> is our priority!
        </h2>
        <p>
          If you need surgery, our operation consultation service will guide you
          through every step. Our medical team will assess your condition,
          discuss treatment options, and explain the procedure, risks, and
          recovery. Book your consultation today for expert advice and
          personalized care.
        </p>

        <div className="operation-buttons">
        <Link to="/client-Radio" >
          <button className="operation-btn">
            Schedule a Surgical Consultation
          </button>
          </Link>
          <Link to="/operation-details" className="operation-link">
            Read More
          </Link>
        </div>
      </div>

      {/* الصورة ثانيًا */}
      <img src={radioImage} alt="Operation" className="operation-image" />
    </div>
  );
};

export default RadioSection;
