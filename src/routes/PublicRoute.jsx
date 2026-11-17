import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Only for guests (e.g. /login). A logged-in user is sent to the dashboard.
 */
export default function PublicRoute() {
  const token = useSelector((state) => state.auth.token);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
