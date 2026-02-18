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
import { ambilSemuaProducts, tambahProduct, editProduct, hapusProduct } from "../services/productService";

function MasterTable() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [brand, setBrand] = useState([]);
  const [subBrands, setSubBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [isSubBrandFormOpen, setIsSubBrandFormOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [subBrandToDelete, setSubBrandToDelete] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editSubBrandData, setEditSubBrandData] = useState(null);
  const [editProductData, setEditProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getBrand = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      const res = await axios.get("http://localhost:3000/api/master-table/", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      setBrand(res.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
      if (error.response?.status === 401) navigate("/login");
    }
  };

  const getSubBrand = async () => {
    try {
      setLoading(true);
      const result = await ambilSemuaSubBrands();
      if (result.success) setSubBrands(result.data);
    } catch (error) { console.error("Error fetching sub brands:", error); }
    finally { setLoading(false); }
  };

  const getProduct = async () => {
    try {
      setLoading(true);
      const result = await ambilSemuaProducts();
      if (result.success) setProducts(result.data);
    } catch (error) { console.error("Error fetching products:", error); }
    finally { setLoading(false); }
  };

  useEffect(() => { getBrand(); getSubBrand(); getProduct(); }, [navigate]);

  const handleAddSubBrand = () => { setEditSubBrandData(null); setIsSubBrandFormOpen(true); };
  const handleEditSubBrand = (subBrand) => { setEditSubBrandData(subBrand); setIsSubBrandFormOpen(true); };
  const handleSubBrandFormSubmit = async (formData, subBrandId) => {
    try {
      setLoading(true);
      const result = subBrandId
        ? await editSubBrand(subBrandId, formData.name, formData.brandId)
        : await tambahSubBrand(formData.name, formData.brandId);
      if (result.success) { showToast(result.message, "success"); setIsSubBrandFormOpen(false); setEditSubBrandData(null); getSubBrand(); }
      else showToast(result.message, "error");
    } catch (error) { showToast("Terjadi kesalahan", "error"); }
    finally { setLoading(false); }
  };
  const handleDeleteSubBrand = (id) => { setSubBrandToDelete(id); setDeleteType("subBrand"); setDeleteModalOpen(true); };
  const confirmDeleteSubBrand = async () => {
    try {
      setLoading(true);
      const result = await hapusSubBrand(subBrandToDelete);
      if (result.success) { showToast(result.message, "success"); getSubBrand(); setDeleteModalOpen(false); setSubBrandToDelete(null); }
      else showToast(result.message, "error");
    } catch (error) { showToast("Terjadi kesalahan", "error"); }
    finally { setLoading(false); }
  };

  const handleAddProduct = () => { setEditProductData(null); setIsProductFormOpen(true); };
  const handleEditProduct = (product) => { setEditProductData(product); setIsProductFormOpen(true); };
  const handleProductFormSubmit = async (formData, productId) => {
    try {
      setLoading(true);
      const result = productId
        ? await editProduct(productId, formData.name, formData.subBrandId, formData.hargaPerCarton, formData.qtyPerCarton)
        : await tambahProduct(formData.name, formData.subBrandId, formData.hargaPerCarton, formData.qtyPerCarton);
      if (result.success) { showToast(result.message, "success"); setIsProductFormOpen(false); setEditProductData(null); getProduct(); }
      else showToast(result.message, "error");
    } catch (error) { showToast("Terjadi kesalahan", "error"); }
    finally { setLoading(false); }
  };
  const handleDeleteProduct = (id) => { setProductToDelete(id); setDeleteType("product"); setDeleteModalOpen(true); };
  const confirmDeleteProduct = async () => {
    try {
      setLoading(true);
      const result = await hapusProduct(productToDelete);
      if (result.success) { showToast(result.message, "success"); getProduct(); setDeleteModalOpen(false); setProductToDelete(null); }
      else showToast(result.message, "error");
    } catch (error) { showToast("Terjadi kesalahan", "error"); }
    finally { setLoading(false); }
  };

  const confirmDelete = () => {
    if (deleteType === "subBrand") confirmDeleteSubBrand();
    else if (deleteType === "product") confirmDeleteProduct();
  };

  return (
    <div className="flex h-screen" style={{ background: "#f1f5f9" }}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto px-7 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "#1e293b" }}>Master Table</h1>
            <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>Kelola data Brand, Sub Brand, dan Product</p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Brand Section */}
            <BrandSection dataBrand={brand} call={getBrand} />

            {/* Sub Brand Section */}
            <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>Sub Brands</span>
                <button
                  onClick={handleAddSubBrand}
                  disabled={loading}
                  className="inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-150 disabled:opacity-50"
                  style={{ background: "#2563eb" }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#1d4ed8"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#2563eb"; }}
                >
                  <Plus size={14} /> Add Sub Brand
                </button>
              </div>
              <SubBrandTable subBrands={subBrands} brands={brand} onEdit={handleEditSubBrand} onDelete={handleDeleteSubBrand} />
            </div>

            {/* Product Section */}
            <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>Products</span>
                <button
                  onClick={handleAddProduct}
                  disabled={loading}
                  className="inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-150 disabled:opacity-50"
                  style={{ background: "#2563eb" }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#1d4ed8"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#2563eb"; }}
                >
                  <Plus size={14} /> Add Product
                </button>
              </div>
              <ProductTable products={products} subBrands={subBrands} brands={brand} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
            </div>
          </div>
        </main>
      </div>

      <Toast isOpen={!!toast} message={toast?.message} type={toast?.type} onClose={() => setToast(null)} duration={3000} />

      <FormSubBrand
        isOpen={isSubBrandFormOpen}
        onClose={() => { setIsSubBrandFormOpen(false); setEditSubBrandData(null); }}
        onSubmit={handleSubBrandFormSubmit}
        onError={(msg) => showToast(msg, "error")}
        brands={brand}
        editData={editSubBrandData}
      />
      <FormProduct
        isOpen={isProductFormOpen}
        onClose={() => { setIsProductFormOpen(false); setEditProductData(null); }}
        onSubmit={handleProductFormSubmit}
        onError={(msg) => showToast(msg, "error")}
        subBrands={subBrands}
        brands={brand}
        editData={editProductData}
      />
      <DeleteConfirmation
        isOpen={deleteModalOpen}
        item={deleteType === "subBrand" ? "Sub Brand" : "Product"}
        onConfirm={confirmDelete}
        onCancel={() => { setDeleteModalOpen(false); setSubBrandToDelete(null); setProductToDelete(null); }}
      />
    </div>
  );
}

export default MasterTable;