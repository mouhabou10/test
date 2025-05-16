import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Login.jsx";
import Signup from "./Signup.jsx";  // Ensure this matches the exported name
import SignupService from "./signupService.jsx"; 
import Prescription from "./prescription.jsx";
import Result from "./result.jsx";
import StaffManagement from "./staffManagement.jsx";
import AccountDemandeList from "./accountDemandeList.jsx";


function AppRoutes() {
  return (
      <Routes>
        
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/service-signup" element={<SignupService />} /> 
        <Route path="/" element={< Login/>} />
        <Route path="/login" element={< Login/>} />
        <Route path="/prescription" element={<Prescription />} />   
        <Route path="/result" element={<Result/>} />  
        <Route path="/staff-manager" element={<StaffManagement/>} />   
        <Route path="/account-demande-list" element={<AccountDemandeList/>} />   
           
        

      </Routes>
  );
}
export default AppRoutes;
