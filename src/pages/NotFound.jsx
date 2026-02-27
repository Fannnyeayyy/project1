import { useNavigate } from "react-router";
import { ArrowLeft, Home, FileX } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#f1f5f9" }}>
      <div className="text-center">

        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl mx-auto mb-6"
          style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
          <FileX size={36} style={{ color: "#2563eb" }} />
        </div>

        {/* 404 */}
        <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Error 404</p>
        <h1 className="text-4xl font-bold mb-3" style={{ color: "#1e293b" }}>Halaman Tidak Ditemukan</h1>
        <p className="text-base mb-8" style={{ color: "#64748b" }}>
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "white", color: "#64748b", border: "1px solid #e2e8f0" }}
          >
            <ArrowLeft size={15} /> Kembali
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#2563eb", border: "none" }}
          >
            <Home size={15} /> Ke Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}