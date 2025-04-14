import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./pages/Routes.jsx";
import './App.css'


function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
export default App;
