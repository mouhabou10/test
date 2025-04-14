import React from 'react'
import Header from "../components/Header.jsx";
import SideBare from "../components/SideBareClient.jsx";
import "./setting.css"
import AccountInfo from "../components/accountInfo.jsx"
const Settings = () => {
  return (
    <div >
      <Header/>
      <SideBare/>
      <p className='account-test'>Account information</p>
      <AccountInfo />
  </div>
  )
}

export default Settings