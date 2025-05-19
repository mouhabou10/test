import React from 'react';
import './AboutUS.css';
import Sidebar from '../component/sidebar.jsx';

const ContactUs = () => {
  return (
   
    
    <div className="contact-wrapper">
    <Sidebar />
      <div className="contact-card">
        <div className="contact-title">Get in Touch with AlgiCare</div>
        <form className="contact-form">
          <div className="contact-field">
            <label className="contact-label">Name</label>
            <input type="text" className="contact-input" placeholder="Your full name" />
          </div>
          <div className="contact-field">
            <label className="contact-label">Email</label>
            <input type="email" className="contact-input" placeholder="Your email address" />
          </div>
          <div className="contact-field">
            <label className="contact-label">Message</label>
            <textarea className="contact-textarea" placeholder="Your message..." />
          </div>
          <button type="submit" className="contact-button">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
