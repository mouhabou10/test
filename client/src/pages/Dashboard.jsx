import React from "react";
import { Link } from "react-router-dom";
import { FaHospital, FaFlask, FaXRay, FaUserMd, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { MdHealthAndSafety, MdScience, MdMedicalServices, MdOutlineLocalHospital } from "react-icons/md";
import Card1 from "../images/healthcare.png";
import Card2 from "../images/mri.png";
import Card3 from "../images/chemistry.png";
import Card4 from "../images/patient.png";
import Header from "../components/Header.jsx";
import SideBareClient from "../components/SideBareClient.jsx";

const Dashboard = () => {
  // Services offered by the platform
  const services = [
    {
      id: 1,
      name: "Consultation",
      description: "Book appointments with doctors and specialists for consultations and medical advice.",
      icon: <FaUserMd size={40} color="#0052E0" />,
      path: "/consultation"
    },
    {
      id: 2,
      name: "Radiology",
      description: "Schedule radiology tests and upload prescriptions for X-rays, MRIs, and other imaging services.",
      icon: <FaXRay size={40} color="#ff9900" />,
      path: "/radio"
    },
    {
      id: 3,
      name: "Laboratory",
      description: "Book laboratory tests and upload prescriptions for blood work, urine analysis, and other tests.",
      icon: <FaFlask size={40} color="#3399ff" />,
      path: "/labo"
    },
    {
      id: 4,
      name: "Operation",
      description: "Schedule surgical procedures and upload operation prescriptions for various medical interventions.",
      icon: <MdOutlineLocalHospital size={40} color="#ff3366" />,
      path: "/opiration"
    }
  ];

  // Features of the platform
  const features = [
    {
      id: 1,
      title: "Easy Appointment Booking",
      description: "Book medical appointments with just a few clicks. Choose from a wide network of healthcare providers.",
      icon: <FaCalendarAlt size={32} color="#0052E0" />
    },
    {
      id: 2,
      title: "Prescription Upload",
      description: "Upload your medical prescriptions securely and get them processed by healthcare providers.",
      icon: <MdScience size={32} color="#0052E0" />
    },
    {
      id: 3,
      title: "Track Requests",
      description: "Monitor the status of your medical requests and appointments in real-time.",
      icon: <MdHealthAndSafety size={32} color="#0052E0" />
    },
    {
      id: 4,
      title: "View Results",
      description: "Access your medical test results and reports securely through our platform.",
      icon: <MdMedicalServices size={32} color="#0052E0" />
    }
  ];

  return (
    <section>
      <Header />
      <SideBareClient />
      
      <div className="home-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Your Health, Our Priority</h1>
            <p className="hero-subtitle">
              A comprehensive healthcare platform that connects you with medical services across Algeria.
              Book appointments, upload prescriptions, and manage your healthcare needs in one place.
            </p>
            <div className="hero-cta">
              <Link to="/consultation" className="primary-button">
                Book an Appointment
              </Link>
              <Link to="/requests" className="secondary-button">
                View My Requests
              </Link>
            </div>
          </div>
          <div className="hero-image-container">
            <div className="hero-image-wrapper">
              <FaHospital size={120} color="#0052E0" className="hero-icon" />
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="home-section">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Comprehensive healthcare services to meet all your medical needs
          </p>
          
          <div className="services-grid">
            {services.map(service => (
              <div key={service.id} className="service-card">
                <div className="service-icon-container">
                  {service.icon}
                </div>
                <h3 className="service-title">{service.name}</h3>
                <p className="service-description">{service.description}</p>
                <Link to={service.path} className="service-link">
                  Get Started <FaArrowRight size={12} style={{ marginLeft: '5px' }} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="home-section alt-bg">
          <h2 className="section-title">Platform Features</h2>
          <p className="section-subtitle">Designed to make healthcare management simple and efficient</p>
          
          <div className="features-grid">
            {features.map(feature => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon-container">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="home-section">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">Trusted by thousands of patients across Algeria</p>
          
          <div className="stats-grid">
            <div className="stat-card">
              <img src={Card1} alt="Consultations" className="stat-icon" />
              <h3 className="stat-number">5000+</h3>
              <p className="stat-label">Consultations</p>
            </div>
            <div className="stat-card">
              <img src={Card2} alt="Radiology Tests" className="stat-icon" />
              <h3 className="stat-number">2500+</h3>
              <p className="stat-label">Radiology Tests</p>
            </div>
            <div className="stat-card">
              <img src={Card3} alt="Laboratory Tests" className="stat-icon" />
              <h3 className="stat-number">3000+</h3>
              <p className="stat-label">Laboratory Tests</p>
            </div>
            <div className="stat-card">
              <img src={Card4} alt="Operations" className="stat-icon" />
              <h3 className="stat-number">1000+</h3>
              <p className="stat-label">Operations</p>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Ready to take control of your health?</h2>
            <p className="cta-text">
              Join thousands of patients who are already managing their healthcare needs with our platform.
            </p>
            <div className="cta-buttons">
              <Link to="/consultation" className="primary-button">
                Book an Appointment
              </Link>
              <Link to="/radio" className="secondary-button">
                Upload Prescription
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



export default Dashboard;
