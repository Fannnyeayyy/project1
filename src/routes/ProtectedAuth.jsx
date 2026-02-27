import { Navigate, Outlet } from "react-router";

export default function ProtectedAuth() {
  const token = localStorage.getItem("token");

  // Kalau sudah login, redirect ke dashboard bukan ke home
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}