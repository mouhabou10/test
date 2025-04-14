import React from "react";

import ConsultationSection from "../component/ConsultationSection.jsx";
import OperationSection from "../component/OperationSection.jsx";
import LabTestsSection from "../component/LabTestsSection.jsx";
import "./HomePage.css";
import HomeHeader from "../component/HomeHeader.jsx";
import RadioSection from "../component/RadioSection.jsx";

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
