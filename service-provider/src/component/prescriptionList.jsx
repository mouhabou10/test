import React from 'react';
import { Filter } from 'lucide-react';
import './list.css';
import PrescriptionTable from './prescriptionTable.jsx';

const PrescriptionList = () => {
  return (
    <div className="carder">
      <form className="filter-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          className="names"
          placeholder='Search "patient"'
        />

        <select className="status-select">
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="pending">Pending</option>
        </select>

        <input type="date" className="date-picker" />

        <button type="submit" className="filter-button">
          <Filter size={16} style={{ marginRight: '4px' }} />
          Filter
        </button>
      </form>

      <PrescriptionTable />
    </div>
  );
};

export default PrescriptionList;
