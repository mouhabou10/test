import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

// Import components for routing
import HomePage from './pages/HomePage.jsx';
import Consultation from './pages/Consultation.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Hospitals from './pages/Hospitals.jsx';
import Labo from './pages/Labo.jsx';
import LaboTicket from './pages/LaboTicket.jsx';
import OnlineTicket from './pages/OnlineTicket.jsx';
import Opiration from './pages/Opiration.jsx';
import Radio from './pages/Radio.jsx';
import RadioTicket from './pages/RadioTicket.jsx';
import Requestes from './pages/Requestes.jsx';
import Result from './pages/Result.jsx';
import Settings from './pages/Settings.jsx';
import PrescriptionRadio from './pages/PriscriotionRadio.jsx';
import PrescriptionLabo from './pages/PriscriptionLabo.jsx';

// Import Layout component
import Layout from './components/Layout.jsx';

function Main() {
  // Define the router setup
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: 'consultation', element: <Consultation /> },
        { path: 'homepage', element: <HomePage /> },
        { path: 'labo', element: <Labo /> },
        { path: 'opiration', element: <Opiration /> },
        { path: 'settings/:id', element: <Settings /> },
        { path: 'requestes/:id', element: <Requestes /> },
        { path: 'radio', element: <Radio /> },
        { path: 'hospitals', element: <Hospitals /> },
        { path: 'result', element: <Result /> },
        { path: 'labo/priscription-labo', element: <PrescriptionLabo /> },
        { path: 'labo/labo-ticket/:id', element: <LaboTicket /> },
        { path: 'radio/priscriotion-radio', element: <PrescriptionRadio /> },
        { path: 'radio/radio-ticket/:id', element: <RadioTicket /> },
        { path: 'radio/radio-ticket/:id/online-ticket', element: <OnlineTicket /> },
        { path: 'labo/labo-ticket/:id/online-ticket', element: <OnlineTicket /> },
      ]
    }
  ]);

  // Render the RouterProvider component with the defined router
  return <RouterProvider router={router} />;
}

// Rendering the app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
