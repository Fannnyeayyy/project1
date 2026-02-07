import React, { useState } from "react";
import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Detail() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar onLogout={handleLogout} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-xl shadow p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Detail Page 📄
            </h1>
            <p className="text-gray-600">
              This is the detail page. Add your content here!
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Detail;