import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Detail from "./pages/Detail.jsx";
import UserPage from "./pages/User.jsx";
import MasterTable from "./pages/MasterTable.jsx";
import Home from "./pages/Home.jsx";
import ProtectedAdmin from "./routes/ProtectedAdmin.jsx";
import ProtectedUser from "./routes/ProtectedUser.jsx";
import ProtectedAuth from "./routes/ProtectedAuth.jsx";
import NotFound from "./pages/NotFound.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Landing page — public */}
        <Route path="/" element={<Home />} />

        {/* Login — hanya kalau belum login */}
        <Route element={<ProtectedAuth />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected routes — semua user yang sudah login */}
        <Route element={<ProtectedUser />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/detail" element={<Detail />} />
        </Route>

        {/* Admin only routes */}
        <Route element={<ProtectedAdmin />}>
          <Route path="/user" element={<UserPage />} />
          <Route path="/master-table" element={<MasterTable />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);