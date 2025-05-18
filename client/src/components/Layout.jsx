import React from 'react'
import {Outlet, useLocation} from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import SideBare from './SideBareClient'
import InfoCard from './InfoCard'

const Layout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  if (isAuthPage) {
    return <Outlet />;
  }
  return (
    <>
      <Header />
      <SideBare/>
      <InfoCard />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout