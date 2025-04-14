import React from "react";
import { FaRegFileAlt } from "react-icons/fa";
const InfoRow = () => {
  return (
    <div className="inforow-container">
      <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
        <FaRegFileAlt size={20} />
        <p>hart surjery</p>
      </div>
      <p>view</p>
    </div>
  );
};

export default InfoRow;
