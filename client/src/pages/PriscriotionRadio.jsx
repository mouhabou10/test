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
      <section>
        <h1 style={{ marginLeft: "40%",marginBottom: "10%", color: "#0052E0",fontSize:"xx-large", alignItems:"center" }}>
           prescription checkup
        </h1>
        {/* Upload Section */}
        <h1 style={{ marginLeft: "20%", color: "#0052E0" }}>upload file</h1>
        <div className="upload-div">
          <div className="upload-section">
            <input type="file" id="file" hidden onChange={handleFileUpload} />
            <label htmlFor="file" className="upload-label">
              <IoCloudUploadOutline size={150} />
            </label>
          </div>
  
          {/* File List */}
          <div className="upload-info">
            <h3 style={{ color: "#0052E0" }}>Uploaded files</h3>
            <div className="uploaded-files-container">
              {files.map((file) => (
                <div className="uploaded-file" key={file.name}>
                  <FaFilePdf className="file-icon" />
                  <div className="file-info">
                    <p>{file.name}</p>
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  {file.progress === 100 ? (
                    <button
                      className="view-btn"
                      onClick={() => handleViewClick(file)}
                    >
                      View
                    </button>
                  ) : (
                    <button
                      className="cancel-btn"
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
        {/* State Selection */}
        <div className="opiration-state-select">
          <div className="State">
            <h1 style={{ color: "#0052E0" }}>Choose a State</h1>
            <div className="State-container">
              <select>
                <option value="state1">State 1</option>
                <option value="state2">State 2</option>
                <option value="state3">State 3</option>
                <option value="state4">State 4</option>
              </select>
            </div>
          </div>
        </div>
        {/* Place Type */}
        <h1 style={{marginLeft:"20%" , color:"#0052E0" }}>shoose type</h1>
        <div className="place-type">
          <div className="hospital">
            {" "}
            <img src={Photo1} alt="error" />
            <p>clinic</p>{" "}
          </div>
          <div className="cabine">
            <img src={Photo2} alt="error" />
            <p>hospital</p>
          </div>
          <div className="clinic">
            <img src={Photo3} alt="error" />
            <p>cabine</p>
          </div>
        </div>
        <div className="">
          <Link>
            <button className="search-btn">Search</button>
          </Link>
        </div>
      </section>
  );
}

export default PriscriotionRadio