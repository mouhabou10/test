import React from 'react'
import { Filter } from 'lucide-react';
import "./list.css"
import PrescriptionTable from './prescriptionTable.jsx';
const PrescriptionList = () => {
  return (
    <div className='carder'>
    <form action=""> 
      <input type="text" className='names' placeholder="search “patient”" />
      <select name="" id="">
        <option value="accepted">
        accepted
        </option>
        <option value="rejected">rejected</option>
        <option value="pending">pending</option>
      </select>
      <input type="date" class="date-picker" />
      <button type='submit' className='filter-button'>
      <Filter />
      Filter
      </button>
    </form>
   <PrescriptionTable className="table"/>
    </div>
  )
}
export default PrescriptionList