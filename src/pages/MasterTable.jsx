import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BrandSection from "../components/mastertable/BrandSection";
import SubBrandTable from "../components/mastertable/SubBrandTable";
import ProductTable from "../components/mastertable/ProductTable";
import FormSubBrand from "../models/FormSubBrand";
import FormProduct from "../models/FormProduct";
import DeleteConfirmation from "../components/DeleteConfirmation";
import Toast from "../components/Toast";
import axios from "axios";
import { ambilSemuaSubBrands, tambahSubBrand, editSubBrand, hapusSubBrand } from "../services/subBrandService";
import { ambilSemuaProducts, tambahProduct, editProduct, hapusProduct } from "../services/ProductService";
function MasterTable() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [brand, setBrand] = useState([]);
  const [subBrands, setSubBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [isSubBrandFormOpen, setIsSubBrandFormOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(null); // "subBrand" or "product"
  const [subBrandToDelete, setSubBrandToDelete] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editSubBrandData, setEditSubBrandData] = useState(null);
  const [editProductData, setEditProductData] = useState(null);
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

  // Get all products
  const getProduct = async () => {
    try {
      setLoading(true);
      const result = await ambilSemuaProducts();
      if (result.success) {
        setProducts(result.data);
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Data Fetching
  useEffect(() => {
    getBrand();
    getSubBrand();
    getProduct();
  }, [navigate]);

  // ===== SUB BRAND HANDLERS =====
  const handleAddSubBrand = () => {
    setEditSubBrandData(null);
    setIsSubBrandFormOpen(true);
  };

  const handleEditSubBrand = (subBrand) => {
    setEditSubBrandData(subBrand);
    setIsSubBrandFormOpen(true);
  };

  const handleSubBrandFormSubmit = async (formData, subBrandId) => {
    try {
      setLoading(true);
      let result;

      if (subBrandId) {
        result = await editSubBrand(subBrandId, formData.name, formData.brandId);
      } else {
        result = await tambahSubBrand(formData.name, formData.brandId);
      }

      if (result.success) {
        showToast(result.message, "success");
        setIsSubBrandFormOpen(false);
        setEditSubBrandData(null);
        getSubBrand();
      } else {
        showToast(result.message, "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubBrand = (id) => {
    setSubBrandToDelete(id);
    setDeleteType("subBrand");
    setDeleteModalOpen(true);
  };

  const confirmDeleteSubBrand = async () => {
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
      console.error("Error:", error);
      showToast("Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  };

  // ===== PRODUCT HANDLERS =====
  const handleAddProduct = () => {
    setEditProductData(null);
    setIsProductFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditProductData(product);
    setIsProductFormOpen(true);
  };

  const handleProductFormSubmit = async (formData, productId) => {
    try {
      setLoading(true);
      let result;

      if (productId) {
        result = await editProduct(productId, formData.name, formData.subBrandId);
      } else {
        result = await tambahProduct(formData.name, formData.subBrandId);
      }

      if (result.success) {
        showToast(result.message, "success");
        setIsProductFormOpen(false);
        setEditProductData(null);
        getProduct();
      } else {
        showToast(result.message, "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = (id) => {
    setProductToDelete(id);
    setDeleteType("product");
    setDeleteModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    try {
      setLoading(true);
      const result = await hapusProduct(productToDelete);

      if (result.success) {
        showToast(result.message, "success");
        getProduct();
        setDeleteModalOpen(false);
        setProductToDelete(null);
      } else {
        showToast(result.message, "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const confirmDelete = () => {
    if (deleteType === "subBrand") {
      confirmDeleteSubBrand();
    } else if (deleteType === "product") {
      confirmDeleteProduct();
    }
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

            {/* Product Section */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">PRODUCTS</h2>
                <button
                  onClick={handleAddProduct}
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 shadow-sm text-sm"
                >
                  <Plus size={18} />
                  Add Product
                </button>
              </div>

              {/* Product Table */}
              <ProductTable
                products={products}
                subBrands={subBrands}
                brands={brand}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
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
        isOpen={isSubBrandFormOpen}
        onClose={() => {
          setIsSubBrandFormOpen(false);
          setEditSubBrandData(null);
        }}
        onSubmit={handleSubBrandFormSubmit}
        brands={brand}
        editData={editSubBrandData}
      />

      <FormProduct
        isOpen={isProductFormOpen}
        onClose={() => {
          setIsProductFormOpen(false);
          setEditProductData(null);
        }}
        onSubmit={handleProductFormSubmit}
        subBrands={subBrands}
        brands={brand}
        editData={editProductData}
      />

      <DeleteConfirmation
        isOpen={deleteModalOpen}
        item={deleteType === "subBrand" ? "Sub Brand" : "Product"}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSubBrandToDelete(null);
          setProductToDelete(null);
        }}
      />
    </div>
  );
}

export default MasterTable;