import React, { useState } from 'react';
import SpecialtyTable from './SpecialtyTable.jsx'; // Import the SpecialtyTable
import './list.css'; // Add your custom styling here

const SpecialtyList = () => {
  const [search, setSearch] = useState(''); // Track search input

  // Handle change in the search input
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  // Sample data for the table (this can be replaced by dynamic data)
  const specialtyData = [
    { serviceType: 'Consultation', serviceName: 'Cardiology', workerId: '123', },
    { serviceType: 'Laboratory', serviceName: 'Blood Test', workerId: '124', },
    { serviceType: 'Radiology', serviceName: 'X-ray', workerId: '125', },
    // Add more data as required
  ];

  // Filter data based on the search term (if any)
  const filteredData = specialtyData.filter((item) =>
    item.serviceName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="carder">
      <form action="">
        {/* Search input for service */}
        <input
          type="text"
          className="names"
          placeholder="Search service"
          value={search}
          onChange={handleSearchChange}
        />
        
        {/* Add button */}
        <button type="button" className="add-button">
          Add
        </button>
      </form>

      {/* Display the table with filtered data */}
      <SpecialtyTable data={filteredData} />
    </div>
  );
};

export default SpecialtyList;