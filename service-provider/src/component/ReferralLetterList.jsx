import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import './list.css';
import ReferralLetterTable from './ReferralLetterTable';

const ReferralLetterList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [filteredData, setFilteredData] = useState({});

  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleStatusChange = (e) => setStatusFilter(e.target.value);
  const handleDateChange = (e) => setDateFilter(e.target.value);

  const applyFilters = (e) => {
    e.preventDefault();
    setFilteredData({
      searchQuery,
      statusFilter,
      dateFilter
    });
  };

  return (
    <div className="carder">
      <form className="filter-form" onSubmit={applyFilters}>
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
        <button type="submit" className="filter-button">
          <Filter size={16} style={{ marginRight: '4px' }} />
          Apply Filters
        </button>
      </form>
      <ReferralLetterTable filters={filteredData} />
    </div>
  );
};

export default ReferralLetterList;