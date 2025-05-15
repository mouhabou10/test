import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Layout from './components/Layout';
import Consultation from './pages/Consultation';
import Dashboard from './pages/Dashboard';
import Labo from './pages/Labo';
import Opiration from './pages/Opiration';
import RadioTicket from './pages/RadioTicket';
import Requestes from './pages/Requestes';
import Result from './pages/Result';
import Radio from './pages/Radio';
import PriscriptionLabo from './pages/PriscriptionLabo';
import LaboTicket from './pages/LaboTicket';
import PriscriotionRadio from './pages/PriscriotionRadio';
import OnlineTicket from './pages/OnlineTicket';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';

// Create router for navigation
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: 'dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute>},
      { path: 'consultation', element: <Consultation /> },
      { path: 'labo', element: <Labo /> },
      { path: 'opiration', element: <Opiration /> },
      { path: 'requestes/:id', element: <Requestes /> },
      { path: 'radio', element: <Radio /> },
      { path: 'result', element: <Result /> },
      { path: 'labo/priscription-labo', element: <PriscriptionLabo /> },
      { path: 'labo/labo-ticket/:id', element: <LaboTicket /> },
      { path: 'radio/priscriotion-radio', element: <PriscriotionRadio /> },
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
