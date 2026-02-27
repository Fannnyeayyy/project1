import { Navigate, Outlet } from "react-router";

export default function ProtectedAdmin() {
  const token = localStorage.getItem("token");
  const admin =
    (JSON.parse(localStorage.getItem("user"))?.role || "").toLowerCase() ===
    "admin";

  if (!token) {
    return <Navigate to="/login" replace />;
  } else if (!admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
  <>
  <Outlet />
  </>);
}