
import React from "react";
import { Link } from "react-router-dom";
import "./OperationSection.css";
import laboImage from "../images/labo.jpg"; // تأكد من مسار الصورة
import Header from "./Header.jsx"
const OperationSection = () => {
  return (
    <div className="operation-container">
    
      {/* الصورة */}
      <img src={laboImage} alt="Operation" className="operation-image" />

      {/* النص */}
      <div className="operation-text">
        <h3 className="section-title">
          Operation <span className="highlight">Consultation</span> section
        </h3>
        <h2 className="priority-text">
          Your <span className="highlight">health</span> is our priority!
        </h2>
        <p>
          If you need surgery, our operation consultation service will guide you
          through every step. Our medical team will assess your condition,
          discuss treatment options, and explain the procedure, risks, and
          recovery. Book your consultation today for expert advice and
          personalized care.
        </p>

        {/* الأزرار */}
        <div className="buttons-container">
        <Link to="/Labo" >
          <button className="appointment-btn">
            Schedule a Surgical Consultation
          </button>
          </Link>
          <Link to="/LabTests-details" className="read-more-link">
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OperationSection;

