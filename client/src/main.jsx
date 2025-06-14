import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Layout from './components/Layout';
import Consultation from './pages/Consultation';
import ConsultationSearch from './pages/ConsultationSearch';
import ConsultationTicket from './pages/ConsultationTicket';
import Dashboard from './pages/Dashboard';
import Labo from './pages/Labo';
import Opiration from './pages/Opiration';
import RadioTicket from './pages/RadioTicket';
import Requestes from './pages/Requestes';
import Requests from './pages/Requests';
import Result from './pages/Result';
import Radio from './pages/Radio';
import PriscriptionLabo from './pages/PriscriptionLabo';
import LaboTicket from './pages/LaboTicket';
import PriscriotionRadio from './pages/PriscriotionRadio';
import OnlineTicket from './pages/OnlineTicket';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import RadioSearchResults from './pages/RadioSearchResults';
import LaboSearchResults from './pages/LaboSearchResults';
import OperationSearchResults from './pages/OperationSearchResults';
import OperationTicket from './pages/OperationTicket';
import Appointments from './pages/Appointments';

// Create router for navigation
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: 'dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute>},
      { path: 'consultation', element: <Consultation /> },
      { path: 'consultation/search', element: <ConsultationSearch /> },
      { path: 'consultation/ticket/:id', element: <ConsultationTicket /> },
      { path: 'labo', element: <Labo /> },
      { path: 'opiration', element: <Opiration /> },
      { path: 'opiration/opiration-search-results', element: <OperationSearchResults /> },
      { path: 'opiration/opiration-ticket/:id', element: <OperationTicket /> },
      { path: 'requestes/:id', element: <Requestes /> },
      { path: 'requests', element: <ProtectedRoute><Requests /></ProtectedRoute> },
      { path: 'appointments', element: <ProtectedRoute><Appointments /></ProtectedRoute> },
      { path: 'radio', element: <Radio /> },
      { path: 'result', element: <Result /> },
      { path: 'labo/priscription-labo', element: <PriscriptionLabo /> },
      { path: 'labo/labo-search-results', element: <LaboSearchResults /> },
      { path: 'labo/labo-ticket/:id', element: <LaboTicket /> },
      { path: 'radio/priscriotion-radio', element: <PriscriotionRadio /> },
      { path: 'radio/radio-search-results', element: <RadioSearchResults /> },
      { path: 'radio/radio-ticket/:id', element: <RadioTicket /> },
      { path: 'radio/radio-ticket/:id/online-ticket', element: <OnlineTicket /> },
      { path: 'labo/labo-ticket/:id/online-ticket', element: <OnlineTicket /> },
      { path: 'login', element: <Login />},
      { path: 'signup', element: <Signup />}
    ]
  }
]);

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
