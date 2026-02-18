import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Edit2, Save, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";

function Dashboard() {

  const baseUrl = 'http://localhost:3000/api/master-table/'

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("Hansaplast");
  const [isEditingForecast, setIsEditingForecast] = useState(false);
  const [forecastData, setForecastData] = useState({
    plan: "Mei 1,5 m",
    week1: "18.622.480",
    week2: "72.241.100",
    week3: "354.064.758",
    week4: "79.171.170"
  });
  const [editForecastData, setEditForecastData] = useState({ ...forecastData });
  const [stats, setStats] = useState({
    totalSales: "Rp 333.333.000",
    totalProducts: 0,
    totalSubBrand: 0,
    growth: {
      sales: "+12.5%",
      products: "+5.2%",
      subBrand: "+3.1%"
    }
  });

  // Forecast history (data bulan lalu)
  const forecastHistory = {
    "April": {
      plan: "April 1,2 m",
      week1: "15.000.000",
      week2: "65.000.000",
      week3: "320.000.000",
      week4: "75.000.000"
    },
    "Maret": {
      plan: "Maret 1,0 m",
      week1: "12.000.000",
      week2: "58.000.000",
      week3: "280.000.000",
      week4: "70.000.000"
    }
  };

  // Dummy brand data
  const brandData = {
    Hansaplast: {
      february: { value: 350000000, label: "Rp 350M" },
      maret: { value: 500000000, label: "Rp 500M" },
      april: { value: 800000000, label: "Rp 800M" },
      totalSales: "Rp 1.650.000.000",
      growth: "+18.5%"
    },
    NIVEA: {
      february: { value: 600000000, label: "Rp 600M" },
      maret: { value: 750000000, label: "Rp 750M" },
      april: { value: 920000000, label: "Rp 920M" },
      totalSales: "Rp 2.270.000.000",
      growth: "+22.3%"
    }
  };

  // Get current brand data
  const currentBrandData = brandData[selectedBrand];
  const chartValues = [
    currentBrandData.february.value,
    currentBrandData.maret.value,
    currentBrandData.april.value
  ];
  const maxValue = Math.max(...chartValues);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // Fetch total products
     const productsRes = await axios.get(`${baseUrl}product/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => null);

      // Fetch total sub brands
      const subBrandsRes = await axios.get(`${baseUrl}sub-brand/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => null);

      // Update stats
      setStats(prev => ({
        ...prev,
        totalProducts: productsRes?.data?.length || 0,
        totalSubBrand: subBrandsRes?.data?.length || 0,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
  };

  const handleEditForecast = () => {
    setEditForecastData({ ...forecastData });
    setIsEditingForecast(true);
  };

  const handleSaveForecast = () => {
    setForecastData({ ...editForecastData });
    setIsEditingForecast(false);
  };

  const handleCancelEdit = () => {
    setIsEditingForecast(false);
  };

  const handleForecastChange = (field, value) => {
    setEditForecastData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar/>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Sales Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stats.totalSales}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
              <p className="text-green-600 text-sm font-semibold mt-4">
                {stats.growth.sales} from last month
              </p>
            </div>

            {/* Total Products Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Product</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {loading ? "..." : stats.totalProducts}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
              </div>
              
            </div>

            {/* Total Sub Brand Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Sub Brand</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {loading ? "..." : stats.totalSubBrand}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏷️</span>
                </div>
              </div>
              <p className="text-green-600 text-sm font-semibold mt-4">
                {stats.growth.subBrand} from last month
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Forecast Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Forecast</h2>
                {!isEditingForecast && (
                  <button
                    onClick={handleEditForecast}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-semibold transition"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                )}
              </div>

              {isEditingForecast ? (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Plan
                    </label>
                    <input
                      type="text"
                      value={editForecastData.plan}
                      onChange={(e) => handleForecastChange("plan", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Mei 1,5 m"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Week 1
                    </label>
                    <input
                      type="text"
                      value={editForecastData.week1}
                      onChange={(e) => handleForecastChange("week1", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 18.622.480"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Week 2
                    </label>
                    <input
                      type="text"
                      value={editForecastData.week2}
                      onChange={(e) => handleForecastChange("week2", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 72.241.100"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Week 3
                    </label>
                    <input
                      type="text"
                      value={editForecastData.week3}
                      onChange={(e) => handleForecastChange("week3", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 354.064.758"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Week 4
                    </label>
                    <input
                      type="text"
                      value={editForecastData.week4}
                      onChange={(e) => handleForecastChange("week4", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 79.171.170"
                    />
                  </div>

                  {/* History Data */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-3">History Data</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {Object.entries(forecastHistory).map(([month, data]) => (
                        <div key={month} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs font-semibold text-gray-900">{month}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            W1: {data.week1} | W2: {data.week2} | W3: {data.week3} | W4: {data.week4}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={handleSaveForecast}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium transition"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="mb-6">
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      IMS PLAN
                    </span>
                    <p className="text-indigo-600 text-lg font-bold mt-2">{forecastData.plan}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Week 1</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">Rp. {forecastData.week1}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Week 2</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">Rp. {forecastData.week2}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Week 3</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">Rp. {forecastData.week3}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Week 4</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">Rp. {forecastData.week4}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Brand Performance Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Brand Performance</h2>
              
              {/* Brand Selector */}
              <div className="mb-6 flex gap-2">
                <button
                  onClick={() => handleBrandSelect("Hansaplast")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    selectedBrand === "Hansaplast"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Hansaplast
                </button>
                <button
                  onClick={() => handleBrandSelect("NIVEA")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    selectedBrand === "NIVEA"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  NIVEA
                </button>
              </div>

              {/* Dynamic Bar Chart */}
              <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-end justify-around gap-4">
                {/* Februari */}
                <div className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-yellow-400 rounded-t transition-all duration-300" 
                    style={{ height: `${(currentBrandData.february.value / maxValue) * 200}px` }}
                  ></div>
                  <p className="text-xs text-gray-600 mt-2">Februari</p>
                  <p className="text-xs font-semibold text-gray-900">{currentBrandData.february.label}</p>
                </div>

                {/* Maret */}
                <div className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-yellow-400 rounded-t transition-all duration-300" 
                    style={{ height: `${(currentBrandData.maret.value / maxValue) * 200}px` }}
                  ></div>
                  <p className="text-xs text-gray-600 mt-2">Maret</p>
                  <p className="text-xs font-semibold text-gray-900">{currentBrandData.maret.label}</p>
                </div>

                {/* April */}
                <div className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-yellow-400 rounded-t transition-all duration-300" 
                    style={{ height: `${(currentBrandData.april.value / maxValue) * 200}px` }}
                  ></div>
                  <p className="text-xs text-gray-600 mt-2">April</p>
                  <p className="text-xs font-semibold text-gray-900">{currentBrandData.april.label}</p>
                </div>
              </div>

              {/* Brand Info */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600 text-sm">Total Sales - {selectedBrand}</p>
                    <p className="text-lg font-bold text-gray-900">{currentBrandData.totalSales}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 text-sm font-semibold">{currentBrandData.growth}</p>
                    <p className="text-gray-600 text-xs">from last month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;