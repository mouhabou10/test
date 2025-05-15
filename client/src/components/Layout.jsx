import React from 'react'
import {Outlet, useLocation} from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import SideBare from './SideBareClient'
import InfoCard from './InfoCard'

const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  if (isLoginPage) {
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