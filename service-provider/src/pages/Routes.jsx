import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Login.jsx";
import Signup from "./Signup.jsx";  // Ensure this matches the exported name
import SignupService from "./signupService.jsx"; 
import Prescription from "./prescription.jsx";
import Result from "./result.jsx";
import StaffManagement from "./staffManagement.jsx";
import AccountDemandeList from "./accountDemandeList.jsx";
import Tiket from "./Tiket.jsx";
import RefferalLetter from "./refferalLetters.jsx";
import AboutUs from "./AboutUs.jsx";
import SettingsPage from "./Settings.jsx";
import ContactUs from "./ContactUs.jsx";
import ProtectedRoute from "../component/ProtectedRoute.jsx";
import useAuth from "../hooks/useAuth.js";
import LogoutButton from "../component/LogoutButton.jsx";
import Speciality from "./speciality.jsx"; // Ensure this matches the exported name
function AppRoutes() {
  return (
<Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/service-signup" element={<SignupService />} />
      {/* Protected Routes */}
      <Route path="/prescription" element={<ProtectedRoute><Prescription /></ProtectedRoute>} />
      <Route path="/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
      <Route path="/staff-manager" element={<ProtectedRoute><StaffManagement /></ProtectedRoute>} />
      <Route path="/account-demande-list" element={<ProtectedRoute><AccountDemandeList /></ProtectedRoute>} />
      <Route path="/Tiket" element={<ProtectedRoute><Tiket /></ProtectedRoute>} />
      <Route path="/refferalletters" element={<ProtectedRoute><RefferalLetter /></ProtectedRoute>} />
      <Route path="/setting" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/contactus" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />
      <Route path="/aboutus" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
      <Route path="/managespeciality" element={<Speciality />} />
    </Routes>
  );
}
export default AppRoutes;
