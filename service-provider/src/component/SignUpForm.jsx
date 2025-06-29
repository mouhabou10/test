import React from 'react';
import "./Form.css";

const SignUpForm = () => {
  return (
    <div className="formrectangle2">
      <div className="signuprectangle">
        <div className="div-but-">
          <h2>Create Account</h2>
          <div className="social-buttons-">
            <button className="btn-sig-">G</button>
            <button className="btn-sig-">F</button>
            <button className="btn-sig-">in</button>
          </div>
          <h8>or use your email for registration</h8>
        </div>
        <select id="wilaya" className="selectord" name="wilaya">
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
        <input type="number" id="numberInput" className="input-fielde" placeholder="National ID (NIN)" />
        <input type="text" id="textInput" className="input-fielde" placeholder="Full Name" />
        <input type="email" placeholder="Email" className="input-fielde" />
        <input type="password" placeholder="Password" className="input-fielde" />
        <input type="password" placeholder="Confirm Password" className="input-fielde" />
        <button className="btn-sign-up" type="submit">Sign Up</button>
      </div>
    </div>
  );
}

export default SignUpForm;
