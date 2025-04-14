
import React from 'react'
import Sidebar from '../component/sidebar.jsx';
import Header from '../component/header.jsx';
import WorkerList from "../component/workersList.jsx"
import './pages.css'
const StaffManagement = () => {
  return (
    <div>
    <Header/>
    <p className='perton'>staff  dashbord</p>
     <WorkerList/>
    <Sidebar/>
    </div>
  )
}
export default StaffManagement