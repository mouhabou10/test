import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Sidebar from "./sidebar.jsx";
import "./sidebar.css";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div className="denied">
      <Sidebar />
      <h1 className="col">Access Denied</h1>
      <p>You do not have permission to view this page.</p>
    </div>;
  }

  return children;
};

export default ProtectedRoute;
