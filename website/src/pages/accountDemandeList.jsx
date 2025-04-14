import React from 'react'
import Sidebar from '../component/sidebar.jsx'

import ServiceProviderList from '../component/serviceProviderList.jsx'
import './pages.css'
import Header from '../component/header.jsx'
const AccountDemandeList = () => {
  return (
    <div>
    <Header/>
    <ServiceProviderList/>
    <Sidebar/>
    </div>
  )
}

export default AccountDemandeList