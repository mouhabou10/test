import React from "react";

import ConsultationSection from "../components/ConsultationSection.jsx";
import OperationSection from "../components/OperationSection.jsx";
import LabTestsSection from "../components/LabTestsSection.jsx";
import "./HomePage.css";
import HomeHeader from "../components/HomeHeader.jsx";
import RadioSection from "../components/RadioSection.jsx";

const HomePage = () => {
  return (
    <div className="home-page">
      <HomeHeader />
      <ConsultationSection />
      <OperationSection />
      <LabTestsSection />
     <RadioSection/>
    </div>
  );
};

export default HomePage;
