import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  // Show loading spinner while checking auth
  

  // If no token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated → show page
  return children;
};

export default ProtectedRoute;
