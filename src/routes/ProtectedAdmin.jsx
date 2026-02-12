import { Navigate, Outlet } from "react-router";

export default function ProtectedAdmin() {
  const token = localStorage.getItem("token");
  const admin = JSON.parse(localStorage.getItem("user"))?.role === "admin";

  if (!token) {
    return <Navigate to="/login" replace />;
  } else if (!admin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
