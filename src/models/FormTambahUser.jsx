import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";

function FormTambahUser({ isOpen, onClose, formData, onInputChange, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  if (!isOpen) return null;

  // Handle click outside modal to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative transform transition-all scale-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition z-10"
        >
          <X size={28} />
        </button>

        {/* Modal Header */}
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800">Tambah User Baru</h2>
          <p className="text-gray-500 text-base mt-2">
            Isi formulir untuk menambahkan user baru ke sistem.
          </p>
        </div>

        {/* Modal Body */}
        <form onSubmit={onSubmit} className="p-8 space-y-6">
          {/* User Name */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={onInputChange}
              required
              className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-800 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Masukkan username"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={onInputChange}
                required
                className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-800 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition pr-12"
                placeholder="Masukkan password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={onInputChange}
              className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 text-base rounded-lg transition shadow-md hover:shadow-lg"
            >
              Simpan User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormTambahUser;