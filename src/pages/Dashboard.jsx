import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { TrendingUp, Package, DollarSign } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState("Hansaplast");
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  // Stats Data
  const statsData = [
    {
      title: "Total Sales",
      value: "Rp 333.333.000",
      trend: "+12.5%",
      icon: DollarSign,
      color: "blue",
    },
    {
      title: "Total Product",
      value: "856",
      trend: "+5.2%",
      icon: Package,
      color: "green",
    },
    {
      title: "Total Sub Brand",
      value: "24",
      trend: "+3.1%",
      icon: TrendingUp,
      color: "purple",
    },
  ];

  // Weekly Forecast Data
  const weeklyData = [
    { week: "Week 1", amount: "Rp. 18,622,480" },
    { week: "Week 2", amount: "Rp. 72,241,100" },
    { week: "Week 3", amount: "Rp. 354,064,758" },
    { week: "Week 4", amount: "Rp. 79,171,170" },
  ];

  // Chart Data per Brand
  const chartDataConfig = {
    Hansaplast: {
      labels: ["Februari", "Maret", "April"],
      datasets: [
        {
          label: "Sales Performance",
          data: [18622480, 72241100, 333333000],
          backgroundColor: [
            "rgba(234, 179, 8, 0.8)",
            "rgba(234, 179, 8, 0.8)",
            "rgba(234, 179, 8, 0.8)",
          ],
          borderColor: [
            "rgba(234, 179, 8, 1)",
            "rgba(234, 179, 8, 1)",
            "rgba(234, 179, 8, 1)",
          ],
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    },
    NIVEA: {
      labels: ["Februari", "Maret", "April"],
      datasets: [
        {
          label: "Sales Performance",
          data: [25000000, 55000000, 250000000],
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(59, 130, 246, 0.8)",
            "rgba(59, 130, 246, 0.8)",
          ],
          borderColor: [
            "rgba(59, 130, 246, 1)",
            "rgba(59, 130, 246, 1)",
            "rgba(59, 130, 246, 1)",
          ],
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    },
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "Rp " + (value / 1000000).toFixed(0) + "M";
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar onLogout={handleLogout} />

        {/* Main Content Area - Fullscreen */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`${colorClasses[stat.color]} p-3 rounded-lg`}
                    >
                      <Icon className="text-white" size={24} />
                    </div>
                    <span className="text-green-600 text-sm font-semibold bg-green-50 px-3 py-1 rounded-full">
                      {stat.trend}
                    </span>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Forecast Section - Fullwidth */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* IMS Plan Card */}
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Forecast</h2>
              </div>

              {/* IMS Plan Badge */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3 inline-block mb-6">
                <p className="text-sm font-medium text-indigo-600">IMS PLAN</p>
                <p className="text-lg font-bold text-indigo-900">Mei 1,5 m</p>
              </div>

              {/* Weekly Data */}
              <div className="grid grid-cols-2 gap-4">
                {weeklyData.map((data, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:bg-gray-100 hover:border-gray-300 transition"
                  >
                    <p className="text-sm text-gray-600 mb-2 font-medium">
                      {data.week}
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {data.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Chart Card */}
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Brand Performance
                </h2>
              </div>

              {/* Brand Selector */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setSelectedBrand("Hansaplast")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm ${
                    selectedBrand === "Hansaplast"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Hansaplast
                </button>
                <button
                  onClick={() => setSelectedBrand("NIVEA")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm ${
                    selectedBrand === "NIVEA"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  NIVEA
                </button>
              </div>

              {/* Chart.js Bar Chart */}
              <div className="h-72">
                <Bar
                  data={chartDataConfig[selectedBrand]}
                  options={chartOptions}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;