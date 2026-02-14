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
import ProtectedAuth from "./routes/ProtectedAuth.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedAuth />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedAdmin />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/mastertable" element={<MasterTable />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
