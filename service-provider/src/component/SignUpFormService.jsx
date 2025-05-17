import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Form.css';

const SignUpFormService = () => {
  const [formData, setFormData] = useState({
    wilaya: '',
    directorId: '',
    type: '',
    speciality: '',
    fullName: '', // ✅ changed from 'name' to 'fullName'
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (formData.directorId.length < 4 || formData.directorId.length > 18) {
      alert('Director ID must be between 4 and 18 characters.');
      return;
    }

    if (formData.type === 'cabine') {
      if (formData.speciality.length < 4 || formData.speciality.length > 18) {
        alert('Speciality must be between 4 and 18 characters.');
        return;
      }
    }

    try {
      const response = await axios.post('http://localhost:3000/api/v1/account-demands', {
        wilaya: formData.wilaya,
        directorId: formData.directorId,
        type: formData.type,
        speciality: formData.speciality,
        fullName: formData.fullName, // ✅ updated key
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      console.log('Registration successful:', response.data);
      alert('Service account demand created successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error registering service.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formrectangle2">
      <div className="signuprectangle">
        <div className="div-but-">
          <h2>Create Account</h2>
          <div className="social-buttons-">
            <button className="btn-sig-" type="button">G</button>
            <button className="btn-sig-" type="button">F</button>
            <button className="btn-sig-" type="button">in</button>
          </div>
          <h8>or use your email for registration</h8>
        </div>

        {/* Wilaya */}
        <select
          id="wilaya"
          className="selectord"
          name="wilaya"
          value={formData.wilaya}
          onChange={handleChange}
        >
      
<option value="">-- Select Wilaya --</option>
<option value="1">Adrar</option>
<option value="2">Chlef</option>
<option value="3">Laghouat</option>
<option value="4">Oum El Bouaghi</option>
<option value="5">Batna</option>
<option value="6">Béjaïa</option>
<option value="7">Biskra</option>
<option value="8">Béchar</option>
<option value="9">Blida</option>
<option value="10">Bouïra</option>
<option value="11">Tamanrasset</option>
<option value="12">Tébessa</option>
<option value="13">Tlemcen</option>
<option value="14">Tiaret</option>
<option value="15">Tizi Ouzou</option>
<option value="16">Algiers</option>
<option value="17">Djelfa</option>
<option value="18">Jijel</option>
<option value="19">Sétif</option>
<option value="20">Saïda</option>
<option value="21">Skikda</option>
<option value="22">Sidi Bel Abbès</option>
<option value="23">Annaba</option>
<option value="24">Guelma</option>
<option value="25">Constantine</option>
<option value="26">Médéa</option>
<option value="27">Mostaganem</option>
<option value="28">M'Sila</option>
<option value="29">Mascara</option>
<option value="30">Ouargla</option>
<option value="31">Oran</option>
<option value="32">El Bayadh</option>
<option value="33">Illizi</option>
<option value="34">Bordj Bou Arréridj</option>
<option value="35">Boumerdès</option>
<option value="36">El Tarf</option>
<option value="37">Tindouf</option>
<option value="38">Tissemsilt</option>
<option value="39">El Oued</option>
<option value="40">Khenchela</option>
<option value="41">Souk Ahras</option>
<option value="42">Tipaza</option>
<option value="43">Mila</option>
<option value="44">Aïn Defla</option>
<option value="45">Naâma</option>
<option value="46">Aïn Témouchent</option>
<option value="47">Ghardaïa</option>
<option value="48">Relizane</option>
<option value="49">Timimoun</option>
<option value="50">Bordj Badji Mokhtar</option>
<option value="51">Ouled Djellal</option>
<option value="52">Béni Abbès</option>
<option value="53">In Salah</option>
<option value="54">Ain Guezzam</option>
<option value="55">Touggourt</option>
<option value="56">Djanet</option>
<option value="57">El M'Ghair</option>
<option value="58">El Menia</option>
        </select>

        <input
          type="text"
          id="directorId"
          className="input-fielde"
          placeholder="Director ID (4-18 characters)"
          name="directorId"
          value={formData.directorId}
          onChange={handleChange}
        />

        {/* Type of Service Provider */}
        <select
          id="type"
          className="selectord"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Type --</option>
          <option value="hospital">🏥 Hospital</option>
          <option value="cabine">🧑‍⚕️ Cabine</option>
          <option value="clinic">🏨 Clinic</option>
        </select>

        {/* Speciality only for cabine */}
        {formData.type === 'cabine' && (
          <input
            type="text"
            id="speciality"
            className="input-fielde"
            placeholder="Speciality (4-18 characters)"
            name="speciality"
            value={formData.speciality}
            onChange={handleChange}
            required
          />
        )}

        {/* ✅ Updated from name to fullName */}
        <input
          type="text"
          id="fullName"
          className="input-fielde"
          placeholder="Service Provider Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="Email"
          className="input-fielde"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="Password"
          className="input-fielde"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="input-fielde"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <button className="btn-sign-up" type="submit">Sign Up</button>
      </div>
    </form>
  );
};

export default SignUpFormService;

