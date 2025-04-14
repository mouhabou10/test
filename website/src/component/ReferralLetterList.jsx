import React from "react";
import { Filter } from "lucide-react";
import "./list.css";
import ReferralLetterTable from "./ReferralLetterTable";

const ReferralLetterList = () => {
  return (
    <div className="carder">
      <form action="">
        <input type="text" className="names" placeholder="search “patient”" />
        <select name="status" id="status">
          <option value="accepted">accepted</option>
          <option value="rejected">rejected</option>
          <option value="pending">pending</option>
        </select>
        <input type="date" className="date-picker" />
        <button type="submit" className="filter-button">
          <Filter />
          Filter
        </button>
      </form>
      <ReferralLetterTable className="table" />
    </div>
  );
};

export default ReferralLetterList;
