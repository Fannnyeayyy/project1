import React, { useState, useMemo } from "react";
import { Edit, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";

function ProductTable({ products, subBrands, brands, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getSubBrandName = (subBrandId) => {
    const sb = subBrands?.find((s) => s.id === subBrandId);
    return sb?.name || "Unknown";
  };

  const getBrandName = (subBrandId) => {
    const sb = subBrands?.find((s) => s.id === subBrandId);
    if (!sb) return "Unknown";
    const brand = brands?.find((b) => b.id === sb.brandId);
    return brand?.name || "Unknown";
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getSubBrandName(p.subBrandId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getBrandName(p.subBrandId).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm, subBrands, brands]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };

  return (
    <>
      {/* Search */}
      <div className="px-6 py-3 flex items-center gap-4" style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={14} style={{ color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Cari product, sub brand, atau brand..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none transition-all"
            style={{ border: "1px solid #e2e8f0", background: "white", color: "#1e293b" }}
            onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
          />
        </div>
        <span className="text-xs" style={{ color: "#94a3b8" }}>
          <strong style={{ color: "#2563eb" }}>{paginatedProducts.length}</strong> dari{" "}
          <strong style={{ color: "#2563eb" }}>{filteredProducts.length}</strong> ditampilkan
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest w-16" style={{ color: "#64748b" }}>No</th>
              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>Nama Product</th>
              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>Sub Brand</th>
              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>Brand</th>
              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>Harga / Karton</th>
              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>Qty / Karton</th>
              <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-widest pr-6" style={{ color: "#64748b" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product, index) => (
                <tr
                  key={product.id}
                  style={{ borderBottom: "1px solid #f1f5f9" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td className="px-6 py-3.5">
                    <span className="text-xs font-mono" style={{ color: "#94a3b8" }}>
                      {String(startIndex + index + 1).padStart(2, "0")}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-sm font-medium" style={{ color: "#1e293b" }}>{product.name}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "#ede9fe", color: "#7c3aed" }}>
                      {getSubBrandName(product.subBrandId)}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "#d1fae5", color: "#10b981" }}>
                      {getBrandName(product.subBrandId)}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-sm font-medium" style={{ color: "#1e293b" }}>
                      {product.hargaPerCarton ? `Rp ${Number(product.hargaPerCarton).toLocaleString("id-ID")}` : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-sm font-medium" style={{ color: "#1e293b" }}>
                      {product.qtyPerCarton ? `${product.qtyPerCarton} pcs` : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => onEdit(product)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #dbeafe" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#dbeafe"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#eff6ff"}
                      >
                        <Edit size={12} /> Edit
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: "#fee2e2", color: "#ef4444", border: "1px solid #fecaca" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#fca5a5"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#fee2e2"}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-sm" style={{ color: "#94a3b8" }}>
                  {searchTerm ? "Tidak ada product yang sesuai" : "Tidak ada product"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3" style={{ borderTop: "1px solid #f1f5f9" }}>
          <span className="text-xs" style={{ color: "#94a3b8" }}>
            Menampilkan {paginatedProducts.length} dari {filteredProducts.length} entri
          </span>
          <div className="flex gap-1 items-center">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-xs transition-all disabled:opacity-40"
              style={{ border: "1px solid #e2e8f0", color: "#64748b" }}
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: currentPage === page ? "#2563eb" : "white",
                  color: currentPage === page ? "white" : "#64748b",
                  border: `1px solid ${currentPage === page ? "#2563eb" : "#e2e8f0"}`,
                }}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-xs transition-all disabled:opacity-40"
              style={{ border: "1px solid #e2e8f0", color: "#64748b" }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductTable;