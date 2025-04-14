import React, { useState } from "react";
import "./AccountInfo.css";

const AccountInfo = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    nin: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log("Submitted:", formData);
    }
  };

  return (
    <div className="card-form-wrapper">
      <form className="form-fields-grid" onSubmit={handleSubmit}>
        <div className="input-field-box">
          <label className="input-label">First Name</label>
          <input
            className="input-control"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
          />
        </div>

        <div className="input-field-box">
          <label className="input-label">Last Name</label>
          <input
            className="input-control"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
          />
        </div>

        <div className="input-field-box">
          <label className="input-label">Email</label>
          <input
            className="input-control"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </div>

        <div className="input-field-box">
          <label className="input-label">Phone Number</label>
          <input
            className="input-control"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
          />
        </div>

        <div className="input-field-box">
          <label className="input-label">Address</label>
          <input
            className="input-control"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
          />
        </div>

        <div className="input-field-box">
          <label className="input-label">Date of Birth</label>
          <input
            className="input-control"
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
          />
        </div>

        <div className="input-field-box full-width">
          <label className="input-label">NIN</label>
          <input
            className="input-control"
            type="text"
            name="nin"
            value={formData.nin}
            onChange={handleChange}
            placeholder="National Identification Number"
          />
        </div>

        <div className="full-width" style={{ textAlign: "center", marginTop: "20px" }}>
          <button type="submit" className="accountinfo-submit-btn">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountInfo;
