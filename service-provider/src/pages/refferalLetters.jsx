
import React from 'react'
import './pages.css'
import Header from '../component/header.jsx'
import List from '../component/list.jsx'
import ReferralLetterList from '../component/ReferralLetterList.jsx'
const RefferalLetter = () => {
  return (
    <div>
    <Header/>
    <p className='perton'>refferal Letters dashbord</p>
    <ReferralLetterList/>
  
    </div>
  )
}
export default RefferalLetter