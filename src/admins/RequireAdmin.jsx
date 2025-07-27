import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireAdmin = ({ children }) => {
  const { authUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!authUser) return <Navigate to="/login" />;

  if (!authUser.isVerified) {
    return <Navigate to="/verify-email" />;
  }
  // uperAdmin a aussi accès à l'espace admin
  if (!authUser.isAdmin && !authUser.isSuperAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RequireAdmin;

