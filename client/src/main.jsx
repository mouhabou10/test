import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';

// Import components for routing
import HomePage from "./pages/HomePage.jsx";
import Consultation from "./pages/Consultation.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Hospitals from "./pages/Hospitals.jsx";
import Labo from "./pages/Labo.jsx";
import LaboTicket from "./pages/LaboTicket.jsx";
import OnlineTicket from "./pages/OnlineTicket.jsx";
import Opiration from "./pages/Opiration.jsx";
import Radio from "./pages/Radio.jsx";
import RadioTicket from "./pages/RadioTicket.jsx";
import Requestes from "./pages/Requestes.jsx";
import Result from "./pages/Result.jsx";
import Settings from "./pages/Settings.jsx";
import PrescriptionRadio from "./pages/PriscriotionRadio.jsx";
import PrescriptionLabo from "./pages/PriscriptionLabo.jsx";
import HospitalCardList from "./components/HospitalCardList.jsx";

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Consultation" element={<Consultation />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Hospitals" element={<Hospitals />} />
        <Route path="/Labo" element={<Labo />} />
        <Route path="/LaboTicket" element={<LaboTicket />} />
        <Route path="/OnlineTiket" element={<OnlineTicket />} />
        <Route path="/Opiration" element={<Opiration />} />
        <Route path="/PrescriptionRadio" element={<PrescriptionRadio />} />
        <Route path="/LaboPrescription" element={<PrescriptionLabo />} />
        <Route path="/Radio" element={<Radio />} />
        <Route path="/RadioTicket" element={<RadioTicket />} />
        <Route path="/Requestes" element={<Requestes />} />
        <Route path="/Result" element={<Result />} />
        <Route path="/Settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

// Rendering the app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
