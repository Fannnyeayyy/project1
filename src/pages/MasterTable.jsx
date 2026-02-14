import React, { useState } from "react";
import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BrandSection from "../components/mastertable/BrandSection";

function MasterTable() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar onLogout={handleLogout} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Master Table
            </h1>
            <p className="text-gray-600">
              Kelola data Brand, Sub Brand, dan Product
            </p>
          </div>

          {/* Cards Container */}
          <div className="space-y-6">
            {/* Brand Section */}
            <BrandSection />

            {/* Sub Brand Card - Coming Soon */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Sub Brand</h2>
              <div className="min-h-[200px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center p-8">
                <p className="text-gray-400 text-center">
                  Sub Brand section - Coming soon
                </p>
              </div>
            </div>

            {/* Product Card - Coming Soon */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Product</h2>
              <div className="min-h-[200px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center p-8">
                <p className="text-gray-400 text-center">
                  Product section - Coming soon
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MasterTable;