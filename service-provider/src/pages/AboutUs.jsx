import React from 'react';
import './AboutUs.css';
import Sidebar from '../component/sidebar.jsx';

const AboutUs = () => {
  return (
    <div className="about-container">
      <Sidebar />
      <h1>About AlgiCare</h1>
      <p>
        <strong>AlgiCare</strong> is a comprehensive medical platform dedicated to improving healthcare access and
        efficiency. We empower doctors, patients, and institutions through innovative digital solutions that enhance
        medical collaboration, streamline document handling, and deliver better care.
      </p>
      <h2>Our Mission</h2>
      <p>
        To revolutionize the healthcare experience by providing a secure, user-friendly platform that connects patients
        and medical professionals through modern tools like e-prescriptions, referral letters, and result sharing.
      </p>
      <h2>Our Vision</h2>
      <p>
        A future where every Algerian has instant access to trusted medical services through AlgiCare, bridging the
        digital healthcare gap across the country.
      </p>
      <h2>Contact Us</h2>
      <p>Email: contact@algicare.com</p>
      <p>Phone: +213 555 123 456</p>
    </div>
  );
};

export default AboutUs;
