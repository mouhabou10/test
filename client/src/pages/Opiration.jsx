import React, { useState } from "react";
import { Categores } from "../components/data";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaFilePdf } from "react-icons/fa";
import Photo1 from "../images/clinic.png";
import Photo2 from "../images/hospital.png";
import Photo3 from "../images/medical-doctor.png";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx"
import SideBareClient from "../components/SideBareClient.jsx"

const Opiration = () => {
  const [category] = useState(Categores);
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
    <section>
      <SideBareClient/>
      <Header/>
      {/* Categories Section */}
      <div className="op-category-container">
        <div className="op-category-title">
          <h1>Choose a category</h1>
          <h3>See all</h3>
        </div>
        <div className="op-category-cards">
          {category.map(({ name, icon, id }) => (
            <div key={id} className="op-category-card">
              <img src={icon} alt={name} />
              <p>{name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* State Selection */}
      <div className="op-operation-state-select">
        <div className="op-State">
          <h1 style={{ color: "#0052E0" }}>Choose a State</h1>
          <div className="op-State-container">
            <select>
              <option value="state1">State 1</option>
              <option value="state2">State 2</option>
              <option value="state3">State 3</option>
              <option value="state4">State 4</option>
            </select>
          </div>
        </div>
      </div>
      {/* Upload Section */}
      <h1 style={{marginLeft:"20%" , color:"#0052E0" }}>upload file</h1>
      <div className="op-upload-div">
        <div className="op-upload-section">
          <input type="file" id="file" hidden onChange={handleFileUpload} />
          <label htmlFor="file" className="op-upload-label">
            <IoCloudUploadOutline size={150} />
          </label>
        </div>

        {/* File List */}
        <div className="op-upload-info">
          <h3 style={{ color: "#0052E0" }}>Uploaded files</h3>
            <div className="op-uploaded-files-container">
            {files.map((file) => (
            <div className="op-uploaded-file" key={file.name}>
              <FaFilePdf className="op-file-icon" />
              <div className="op-file-info">
                <p>{file.name}</p>
                <div className="op-progress-bar">
                  <div className="op-progress" style={{ width: `${file.progress}%` }}></div>
                </div>
              </div>
              {file.progress === 100 ? (
                <button
                  className="op-view-btn"
                  onClick={() => handleViewClick(file)}
                >
                  View
                </button>
              ) : (
                <button
                  className="op-cancel-btn"
                  onClick={() => handleCancel(file.name)}
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
            </div>
        </div>
      </div>
      <h1 style={{marginLeft:"20%" , color:"#0052E0" }}>choose type</h1>
      {/* Place Type */}
      <div className="op-place-type">
          <div className="op-hospital"> <img src={Photo1} alt="error"/><p>clinic</p> </div>
          <div className="op-cabine"><img src={Photo2} alt="error"/><p>hospital</p></div>
          <div className="op-clinic"><img src={Photo3} alt="error"/><p>cabine</p></div>
      </div>
      <div className="">
        <Link>
          <button className="op-search-btn">Search</button>
        </Link>
      </div>
    </section>
  );
};

export default Opiration;