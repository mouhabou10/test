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
<option value="Adrar">Adrar</option>
<option value="Chlef">Chlef</option>
<option value="Laghouat">Laghouat</option>
<option value="Oum El Bouaghi">Oum El Bouaghi</option>
<option value="Batna">Batna</option>
<option value="Béjaïa">Béjaïa</option>
<option value="Biskra">Biskra</option>
<option value="Béchar">Béchar</option>
<option value="Blida">Blida</option>
<option value="Bouïra">Bouïra</option>
<option value="Tamanrasset">Tamanrasset</option>
<option value="Tébessa">Tébessa</option>
<option value="Tlemcen">Tlemcen</option>
<option value="Tiaret">Tiaret</option>
<option value="Tizi Ouzou">Tizi Ouzou</option>
<option value="Algiers">Algiers</option>
<option value="Djelfa">Djelfa</option>
<option value="Jijel">Jijel</option>
<option value="Sétif">Sétif</option>
<option value="Saïda">Saïda</option>
<option value="Skikda">Skikda</option>
<option value="Sidi Bel Abbès">Sidi Bel Abbès</option>
<option value="Annaba">Annaba</option>
<option value="Guelma">Guelma</option>
<option value="Constantine">Constantine</option>
<option value="Médéa">Médéa</option>
<option value="Mostaganem">Mostaganem</option>
<option value="M'Sila">M'Sila</option>
<option value="Mascara">Mascara</option>
<option value="Ouargla">Ouargla</option>
<option value="Oran">Oran</option>
<option value="El Bayadh">El Bayadh</option>
<option value="Illizi">Illizi</option>
<option value="Bordj Bou Arréridj">Bordj Bou Arréridj</option>
<option value="Boumerdès">Boumerdès</option>
<option value="El Tarf">El Tarf</option>
<option value="Tindouf">Tindouf</option>
<option value="Tissemsilt">Tissemsilt</option>
<option value="El Oued">El Oued</option>
<option value="Khenchela">Khenchela</option>
<option value="Souk Ahras">Souk Ahras</option>
<option value="Tipaza">Tipaza</option>
<option value="Mila">Mila</option>
<option value="Aïn Defla">Aïn Defla</option>
<option value="Naâma">Naâma</option>
<option value="Aïn Témouchent">Aïn Témouchent</option>
<option value="Ghardaïa">Ghardaïa</option>
<option value="Relizane">Relizane</option>
<option value="Timimoun">Timimoun</option>
<option value="Bordj Badji Mokhtar">Bordj Badji Mokhtar</option>
<option value="Ouled Djellal">Ouled Djellal</option>
<option value="Béni Abbès">Béni Abbès</option>
<option value="In Salah">In Salah</option>
<option value="Ain Guezzam">Ain Guezzam</option>
<option value="Touggourt">Touggourt</option>
<option value="Djanet">Djanet</option>
<option value="El M'Ghair">El M'Ghair</option>
<option value="El Menia">El Menia</option>
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

