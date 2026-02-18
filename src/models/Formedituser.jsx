import React from "react";
import { X, Eye, EyeOff } from "lucide-react";

function FormEditUser({ isOpen, onClose, formData, onInputChange, onSubmit }) {
  const [showPassword, setShowPassword] = React.useState(false);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Edit User</h2>
              <p className="text-gray-500 text-base mt-2">
                Isi formulir untuk mengubah data user.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X size={28} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Username */}
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
                value={formData.password || ""}
                onChange={onInputChange}
                className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-800 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition pr-12"
                placeholder="Kosongkan jika tidak diubah"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              * Kosongkan jika tidak ingin mengubah password
            </p>
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
              required
              className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold text-base transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg text-base"
            >
              Simpan User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormEditUser;