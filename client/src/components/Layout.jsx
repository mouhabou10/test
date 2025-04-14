import React from 'react'
import {Outlet} from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import SideBare from './SideBareClient'
import InfoCard from './InfoCard'

const Layout = () => {
  return (
    <>
      <Header />
      <SideBare/>
      <InfoCard />
      <Outlet />
      <Footer />
    </>
  )
}

export default Layout