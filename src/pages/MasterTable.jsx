import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BrandSection from "../components/mastertable/BrandSection";
import SubBrandTable from "../components/mastertable/SubBrandTable";
import FormSubBrand from "../models/FormSubBrand";
import DeleteConfirmation from "../components/DeleteConfirmation";
import Toast from "../components/Toast";
import axios from "axios";
import { ambilSemuaSubBrands, tambahSubBrand, editSubBrand, hapusSubBrand } from "../services/subBrandService";

function MasterTable() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [brand, setBrand] = useState([]);
  const [subBrands, setSubBrands] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subBrandToDelete, setSubBrandToDelete] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Show toast
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Get all brands
  const getBrand = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }
      
      const res = await axios.get("http://localhost:3000/api/master-table/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setBrand(res.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  // Get all sub brands
  const getSubBrand = async () => {
    try {
      setLoading(true);
      const result = await ambilSemuaSubBrands();
      if (result.success) {
        setSubBrands(result.data);
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error fetching sub brands:", error);
    } finally {
      setLoading(false);
    }
  };

  // Data Fetching
  useEffect(() => {
    getBrand();
    getSubBrand();
  }, [navigate]);

  // Handle add sub brand
  const handleAddSubBrand = () => {
    setEditData(null);
    setIsFormOpen(true);
  };

  // Handle edit sub brand
  const handleEditSubBrand = (subBrand) => {
    setEditData(subBrand);
    setIsFormOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = async (formData, subBrandId) => {
    try {
      setLoading(true);
      let result;

      if (subBrandId) {
        // Edit mode
        result = await editSubBrand(subBrandId, formData.name, formData.brandId);
      } else {
        // Add mode
        result = await tambahSubBrand(formData.name, formData.brandId);
      }

      if (result.success) {
        showToast(result.message, "success");
        setIsFormOpen(false);
        setEditData(null);
        getSubBrand();
      } else {
        showToast(result.message, "error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showToast("Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDeleteSubBrand = (id) => {
    setSubBrandToDelete(id);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      setLoading(true);
      const result = await hapusSubBrand(subBrandToDelete);

      if (result.success) {
        showToast(result.message, "success");
        getSubBrand();
        setDeleteModalOpen(false);
        setSubBrandToDelete(null);
      } else {
        showToast(result.message, "error");
      }
    } catch (error) {
      console.error("Error deleting sub brand:", error);
      showToast("Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  };

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
            <BrandSection dataBrand={brand} call={getBrand} />

            {/* Sub Brand Section */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">SUB BRANDS</h2>
                <button
                  onClick={handleAddSubBrand}
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 shadow-sm text-sm"
                >
                  <Plus size={18} />
                  Add Sub Brand
                </button>
              </div>

              {/* Sub Brand Table */}
              <SubBrandTable
                subBrands={subBrands}
                brands={brand}
                onEdit={handleEditSubBrand}
                onDelete={handleDeleteSubBrand}
              />
            </div>

            {/* Product Card - Coming Soon */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Product
              </h2>
              <div className="min-h-[200px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center p-8">
                <p className="text-gray-400 text-center">
                  Product section - Coming soon
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Forms & Modals */}
      <FormSubBrand
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditData(null);
        }}
        onSubmit={handleFormSubmit}
        brands={brand}
        editData={editData}
      />

      <DeleteConfirmation
        isOpen={deleteModalOpen}
        item="Sub Brand"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSubBrandToDelete(null);
        }}
      />
    </div>
  );
}

export default MasterTable;