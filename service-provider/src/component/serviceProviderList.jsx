import React, { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import './list.css';
import ServiceProviderTable from './serviceProviderTable.jsx';
import axios from 'axios';

const ServiceProviderList = () => {
  const [demands, setDemands] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [accountType, setAccountType] = useState('');
  const [wilaya, setWilaya] = useState('');

  useEffect(() => {
    const fetchDemands = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/account-demands/all-demands');
        setDemands(res.data.data);
        setFiltered(res.data.data);
      } catch (err) {
        console.error('Failed to fetch account demands:', err);
      }
    };

    fetchDemands();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();

    const filteredData = demands.filter(demand => {
      const matchName = demand.fullName?.toLowerCase().includes(search.toLowerCase());
      const matchType = accountType ? demand.type === accountType : true;
      const matchWilaya = wilaya ? demand.wilaya === wilaya : true;
      return matchName && matchType && matchWilaya;
    });

    setFiltered(filteredData);
  };

  return (
    <div className="carder">
      <form onSubmit={handleFilter}>
        <input
          type="text"
          className="names"
          placeholder="Search by full name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
          <option value="">All</option>
          <option value="hospital">Consultation Agent</option>
          <option value="clinic">Labo Agent</option>
          <option value="cabine">Radio Agent</option>
          <option value="chef">Department Chef</option>
        </select>
        <input
          type="text"
          className="wilaya-input"
          placeholder="Wilaya"
          value={wilaya}
          onChange={(e) => setWilaya(e.target.value)}
        />
        <button type="submit" className="filter-button">
          <Filter />
          Filter
        </button>
      </form>

      <ServiceProviderTable data={filtered} />
    </div>
  );
};

export default ServiceProviderList;
