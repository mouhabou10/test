import React from 'react';
import { Filter } from 'lucide-react';
import './list.css';
import ServiceProviderTable from './serviceProviderTable.js';

const ServiceProviderList = () => {
  return (
    <div className="carder">
      <form action="">
        <input
          type="text"
          className="names"
          placeholder="search hospital/clinic/cabinet"
        />
        <select name="" id="">
          <option value="consultation-agent">Consultation Agent</option>
          <option value="labo-agent">Labo Agent</option>
          <option value="radio-agent">Radio Agent</option>
          <option value="department-chef">Department Chef</option>
        </select>
        <input
          type="text"
          className="director-job-id"
          placeholder="Director Job ID"
        />
        <button type="submit" className="filter-button">
          <Filter />
          Filter
        </button>
      </form>
      <ServiceProviderTable className="table" />
    </div>
  );
};

export default ServiceProviderList;
