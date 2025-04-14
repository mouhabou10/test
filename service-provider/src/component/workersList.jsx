import React from 'react';
import { Filter } from 'lucide-react';
import "./list.css";
import WorkerTable from './workerTable.jsx'; // Ensure this is the correct path for your new table component

const workersList = () => {
  return (
    <div className='carder'>
      <form action="">
        <input type="text" className='names' placeholder="Search worker" />
        <select name="title" id="title">
          <option value="consultation-agent">Consultation Agent</option>
          <option value="labo-agent">Labo Agent</option>
          <option value="radio-agent">Radio Agent</option>
          <option value="department-chef">Department Chef</option>
        </select>
        <input type="date" className="date-picker" />
        <button type='submit' className='filter-button'>
          <Filter />
          Filter
        </button>
      </form>
      <WorkerTable className="table" />
    </div>
  );
};

export default workersList;
