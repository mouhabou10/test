import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage.jsx";
import Consultation from "./Consultation.jsx";
import Dashboard from "./Dashboard.jsx";
import Hospitals from "./Hospitals.jsx";
import Labo from "./Labo.jsx";
import LaboTicket from "./LaboTicket.jsx";
import OnlineTicket from "./OnlineTicket.jsx";
import Opiration from "./Opiration.jsx";
import Radio from "./Radio.jsx";
import RadioTicket from "./RadioTicket.jsx";
import Requestes from "./Requestes.jsx";
import Result from "./Result.jsx";
import Settings from "./Settings.jsx";
import PrescriptionRadio from "./PriscriotionRadio.jsx";
import PrescriptionLabo from "./PriscriptionLabo.jsx";
import HospitalCardList from "../components/HospitalCardList.jsx";

function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/Consultation" element={<Consultation/>} />
        <Route path="/Dashboard" element={<Dashboard />} /> 
        <Route path="/Hospitals" element={<Hospitals />} /> 
        <Route path="/Labo" element={<Labo />} />   
        <Route path="/LaboTicket" element={<LaboTicket/>} />  
        <Route path="/OnlineTiket" element={<OnlineTicket/>} />   
        <Route path="/Opiration" element={<Opiration/>} />   
        <Route path="/PrescriptionRadio" element={<PrescriptionRadio/>} />   
        <Route path="/LaboPrescription" element={<PrescriptionLabo/>} />  
        <Route path="/Radio" element={<Radio/>} />  
        <Route path="/RadioTicket" element={<RadioTicket/>} /> 
        <Route path="/Requestes" element={<Requestes/>} />   
        <Route path="/Result" element={<Result/>} />  
        <Route path="/Settings" element={<Settings/>} />  
      </Routes>
  );
}
export default AppRoutes;
