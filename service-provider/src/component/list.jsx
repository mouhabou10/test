import React from 'react'
import { Filter } from 'lucide-react';
import "./list.css"
import Table from './ResultTable.jsx';
const List = () => {
  return (
    <div className='carder'>
    <form action=""> 
      <input type="text" className='names' placeholder="search “patient”" />
      <select name="" id="">
        <option value="uploaded">
        uploaded
        </option>
        <option value="pending">pending</option>
      </select>
      <input type="date" class="date-picker" />
      <button type='submit' className='filter-button'>
      <Filter />
      Filter
      </button>
    </form>
   <Table className="table"/>
    </div>
  )
}
export default List