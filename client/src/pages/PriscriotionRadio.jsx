import React from "react";
import { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaFilePdf } from "react-icons/fa";
import Photo1 from "../images/clinic.png";
import Photo2 from "../images/hospital.png";
import Photo3 from "../images/medical-doctor.png";
import { Link } from "react-router-dom";

const PriscriotionRadio = () => {
    const [files, setFiles] = useState([]);

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
      setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    };
  
    const handleViewClick = (file) => {
      const fileUrl = URL.createObjectURL(file.file);
      window.open(fileUrl, "_blank");
    };
  
    return (
      <section className="prescription-page">
        <div className="prescription-container">
          <h1 className="main-title">Prescription Checkup</h1>          {/* Upload Section */}
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
              <select className="state-select">
                <option value="">Select a state</option>
                <option value="state1">State 1</option>
                <option value="state2">State 2</option>
                <option value="state3">State 3</option>
                <option value="state4">State 4</option>
              </select>
            </div>
          </div>

          {/* Place Type */}
          <div className="place-section">
            <h2 className="section-title">Choose Type</h2>
            <div className="place-type">
              <div className="place-card">
                <img src={Photo1} alt="Clinic" className="place-image" />
                <p className="place-name">Clinic</p>
              </div>
              <div className="place-card">
                <img src={Photo2} alt="Hospital" className="place-image" />
                <p className="place-name">Hospital</p>
              </div>
              <div className="place-card">
                <img src={Photo3} alt="Cabinet" className="place-image" />
                <p className="place-name">Cabinet</p>
              </div>
            </div>
          </div>

          <div className="search-container">
            <Link to="/search">
              <button className="search-btn">Search</button>
            </Link>
          </div>
        </div>
      </section>
    );
}

export default PriscriotionRadio