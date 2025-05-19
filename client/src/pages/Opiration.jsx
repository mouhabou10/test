import React, { useState, useEffect } from "react";
import { Categores } from "../components/data";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaFilePdf } from "react-icons/fa";
import Photo1 from "../images/clinic.png";
import Photo2 from "../images/hospital.png";
import Photo3 from "../images/medical-doctor.png";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx"
import SideBareClient from "../components/SideBareClient.jsx"
import axios from "axios";

// Import specialty icons for categories
import DentistryIcon from "../images/spicialites/dentistry.png";
import EmergencyMedicineIcon from "../images/spicialites/Emergency Medicine.png";
import EndocrinologyIcon from "../images/spicialites/endocrinology.png";
import KidneyIcon from "../images/spicialites/kidney.png";
import NeurologyIcon from "../images/spicialites/neurology.png";
import OphthalmologyIcon from "../images/spicialites/ophthalmology.png";
import PediatricsIcon from "../images/spicialites/pediatrics.png";
import RheumatologyIcon from "../images/spicialites/rheumatology.png";

const wilayas = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane"
];

const Opiration = () => {
  const [categories, setCategories] = useState(Categores);
  const [files, setFiles] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  
  // Map specialty names to their respective images
  const specialtyImageMap = {
    'Cardiology': DentistryIcon,
    'psychiatrist': EmergencyMedicineIcon,
    'Neurology': EndocrinologyIcon,
    'Ophthalmology': KidneyIcon,
    'Orthopedics': NeurologyIcon,
  };

  useEffect(() => {
    if (files.length > 0 && files.every(file => file.progress === 100)) {
      const fileInfos = files.map(file => ({
        name: file.name,
        type: file.file.type,
        size: file.file.size,
        progress: file.progress
      }));
      localStorage.setItem('operationFiles', JSON.stringify(fileInfos));
    }
  }, [files]);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    // Validate file type (PDF only)
    if (uploadedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }

    // Validate file size (max 5MB)
    if (uploadedFile.size > 5 * 1024 * 1024) {
      setError("File size should not exceed 5MB");
      return;
    }

    setError(""); // Clear any previous errors

    const newFile = {
      name: uploadedFile.name,
      file: uploadedFile,
      progress: 0,
    };

    setFiles((prevFiles) => [...prevFiles, newFile]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.name === newFile.name ? { ...file, progress } : file
        )
      );
      if (progress >= 100) clearInterval(interval);
    }, 300);
  };

  const handleCancel = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const handleViewClick = (file) => {
    const fileUrl = URL.createObjectURL(file.file);
    window.open(fileUrl, "_blank");
  };

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleSearch = async () => {
    if (!selectedState) {
      setError("Please select a state");
      return;
    }

    if (!selectedType) {
      setError("Please select a service provider type");
      return;
    }

    if (!selectedCategory) {
      setError("Please select a category");
      return;
    }

    if (files.length === 0) {
      setError("Please upload at least one prescription file");
      return;
    }

    if (!files.every(file => file.progress === 100)) {
      setError("Please wait for all files to finish uploading");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Store search parameters in localStorage for the results page
      localStorage.setItem('operationSearchParams', JSON.stringify({
        state: selectedState,
        type: selectedType,
        category: selectedCategory,
        files: files.map(f => ({
          name: f.name,
          size: f.file.size,
          type: f.file.type
        }))
      }));

      // Navigate to search results page
      navigate('/opiration/opiration-search-results');
    } catch (error) {
      console.error('Search error:', error);
      setError("An error occurred during search. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section>
      <SideBareClient/>
      <Header/>
      {/* Categories Section - Keep as is */}
      <div className="category-container">
        <div className="category-title">
          <h1>Choose a speciality for operation</h1>
          <h3>See all</h3>
        </div>
        <div className="category-cards">
          {categories.map(({ name, icon, id }) => (
            <div 
              key={id} 
              className={`category-card ${selectedCategory === name ? 'selected' : ''}`}
              onClick={() => handleCategorySelect(name)}
              style={{
                border: selectedCategory === name ? '2px solid #0052E0' : 'none',
                cursor: 'pointer',
                backgroundColor: selectedCategory === name ? '#f0f7ff' : 'white'
              }}
            >
              {icon ? (
                <img src={icon} alt={name} style={{ width: '48px', height: '48px', marginBottom: '8px' }} />
              ) : (
                <div 
                  style={{ 
                    width: '48px', 
                    height: '48px', 
                    marginBottom: 8,
                    background: '#0167FB',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px'
                  }}
                >
                  {name.charAt(0)}
                </div>
              )}
              <p>{name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="prescription-container">
        {/* Upload Section - Exactly like PriscriptionLabo */}
        <div className="upload-section">
          <h2 className="section-title">Upload Prescription</h2>
          <div className="upload-container">
            <div className="upload-area">
              <input type="file" id="file" hidden accept=".pdf" onChange={handleFileUpload} />
              <label htmlFor="file" className="upload-label">
                <IoCloudUploadOutline className="upload-icon" />
                <div className="upload-text">
                  <p className="upload-title">Click to upload</p>
                  <span className="upload-description">
                    Upload your operation prescription
                    <br />
                    <small className="upload-formats">
                      Supported formats: PDF
                    </small>
                  </span>
                </div>
              </label>
            </div>
            {files.length > 0 && (
              <div className="upload-info">
                <h3 className="subsection-title">
                  Uploaded Files ({files.length})
                </h3>
                <div className="uploaded-files-container">
                  {files.map((file) => (
                    <div className="uploaded-file" key={file.name}>
                      <FaFilePdf className="file-icon" />
                      <div className="file-info">
                        <p className="file-name">{file.name}</p>
                        <div className="progress-bar">
                          <div
                            className="progress"
                            style={{
                              width: `${file.progress}%`,
                              transition: 'width 0.3s ease-in-out'
                            }}
                          />
                        </div>
                      </div>
                      {file.progress === 100 ? (
                        <button
                          className="action-btn view-btn"
                          onClick={() => handleViewClick(file)}
                        >
                          View
                        </button>
                      ) : (
                        <button
                          className="action-btn cancel-btn"
                          onClick={() => handleCancel(file.name)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* State Selection - Exactly like PriscriptionLabo */}
        <div className="state-section">
          <h2 className="section-title">Choose a State</h2>
          <div className="state-container">
            <select
              className="state-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">Select a state</option>
              {wilayas.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Place Type - Exactly like PriscriptionLabo */}
        <div className="place-section">
          <h2 className="section-title">Choose Type</h2>
          <div className="place-type">
            <div
              className={`place-card${selectedType === 'clinic' ? ' selected' : ''}`}
              onClick={() => handleTypeSelect('clinic')}
            >
              <img src={Photo1} alt="Clinic" className="place-image" />
              <p className="place-name">Clinic</p>
            </div>
            <div
              className={`place-card${selectedType === 'hospital' ? ' selected' : ''}`}
              onClick={() => handleTypeSelect('hospital')}
            >
              <img src={Photo2} alt="Hospital" className="place-image" />
              <p className="place-name">Hospital</p>
            </div>
            <div
              className={`place-card${selectedType === 'cabine' ? ' selected' : ''}`}
              onClick={() => handleTypeSelect('cabine')}
            >
              <img src={Photo3} alt="Cabinet" className="place-image" />
              <p className="place-name">Cabinet</p>
            </div>
          </div>
        </div>

        {/* Search Container - Exactly like PriscriptionLabo */}
        <div className="search-container">
          <button 
            className="search-btn" 
            onClick={handleSearch} 
            disabled={loading || !selectedCategory || !selectedType || !selectedState || files.length === 0}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </section>
  );
};

export default Opiration;