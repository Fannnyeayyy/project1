import { Navigate, Outlet } from "react-router";

export default function ProtectedAuth() {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" replace />
  }

  return <Outlet />;
}
