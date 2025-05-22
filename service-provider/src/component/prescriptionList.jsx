import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import './list.css';
import PrescriptionTable from './prescriptionTable.jsx';

const PrescriptionList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [filteredData, setFilteredData] = useState({});
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
  };
  
  const applyFilters = (e) => {
    e.preventDefault();
    // Pass filter values to PrescriptionTable
    setFilteredData({
      searchQuery,
      statusFilter,
      dateFilter
    });
  };
  
  return (
    <div className="carder">
      <form className="filter-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          className="names"
          placeholder='Search "patient"'
          value={searchQuery}
          onChange={handleSearch}
        />

        <select 
          className="status-select"
          value={statusFilter}
          onChange={handleStatusChange}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="cancelled">Rejected</option>
          <option value="completed">Completed</option>
        </select>

        <input 
          type="date" 
          className="date-picker" 
          value={dateFilter}
          onChange={handleDateChange}
        />

        <button 
          type="submit" 
          className="filter-button"
          onClick={applyFilters}
        >
          <Filter size={16} style={{ marginRight: '4px' }} />
          Apply Filters
        </button>
      </form>

      <PrescriptionTable filters={filteredData} />
    </div>
  );
};

export default PrescriptionList;
