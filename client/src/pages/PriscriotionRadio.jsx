import React, { useState, useEffect } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaFilePdf } from "react-icons/fa";
import Photo1 from "../images/clinic.png";
import Photo2 from "../images/hospital.png";
import Photo3 from "../images/medical-doctor.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const wilayas = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane"
];

const PriscriotionRadio = () => {
  const [files, setFiles] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (files.length > 0 && files.every(file => file.progress === 100)) {
      const fileInfos = files.map(file => ({
        name: file.name,
        type: file.file.type,
        size: file.file.size,
        progress: file.progress,
      }));
      localStorage.setItem("uploadedRadioFileInfos", JSON.stringify(fileInfos));
      window.uploadedRadioFiles = files;
    }
  }, [files]);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;
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
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((file) => file.name !== fileName);
      if (updatedFiles.length === 0) {
        localStorage.removeItem("uploadedRadioFileInfos");
        if (window.uploadedRadioFiles) {
          delete window.uploadedRadioFiles;
        }
      } else if (updatedFiles.every(file => file.progress === 100)) {
        const fileInfos = updatedFiles.map(file => ({
          name: file.name,
          type: file.file.type,
          size: file.file.size,
          progress: file.progress,
        }));
        localStorage.setItem("uploadedRadioFileInfos", JSON.stringify(fileInfos));
        window.uploadedRadioFiles = updatedFiles;
      }
      return updatedFiles;
    });
  };

  const handleViewClick = (file) => {
    const fileUrl = URL.createObjectURL(file.file);
    window.open(fileUrl, "_blank");
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleSearch = async () => {
    setError("");
    setResults([]);
    if (!selectedState || !selectedType) {
      setError("Please select a state and choose a type.");
      return;
    }
    if (files.length === 0) {
      setError("Please upload your prescription before searching.");
      return;
    }
    if (!files.every(file => file.progress === 100)) {
      setError("Please wait for all files to finish uploading.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/service-providers/search/service-providers`, {
        params: {
          wilaya: selectedState,
          type: selectedType,
        },
      });
      localStorage.setItem("radioSearchResults", JSON.stringify(res.data.data));
      navigate("/radio/radio-search-results");
    } catch (err) {
      setError("Failed to fetch results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="prescription-page">
      <div className="prescription-container">
        <h1 className="main-title">Prescription Checkup</h1>
        {/* Upload Section */}
        <div className="upload-container">
          <h2 className="section-title">Upload Your Prescription</h2>
          <div className="upload-div">
            <div className="upload-section">
              <input
                type="file"
                id="file"
                hidden
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
              />
              <label htmlFor="file" className="upload-label">
                <IoCloudUploadOutline className="upload-icon" />
                <span>
                  Drag and drop your prescription here or click to browse
                  <br />
                  <small style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Supported formats: PDF, JPG, JPEG, PNG
                  </small>
                </span>
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
        {/* State Selection */}
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
        {/* Place Type */}
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
              className={`place-card${selectedType === 'cabinet' ? ' selected' : ''}`}
              onClick={() => handleTypeSelect('cabinet')}
            >
              <img src={Photo3} alt="Cabinet" className="place-image" />
              <p className="place-name">Cabinet</p>
            </div>
          </div>
        </div>
        {/* Search Container */}
        <div className="search-container">
          <button className="search-btn" onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
          {error && <div className="error-message" style={{marginTop: '1rem'}}>{error}</div>}
        </div>
      </div>
    </section>
  );
};

export default PriscriotionRadio;