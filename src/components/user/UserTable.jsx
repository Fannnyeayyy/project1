import React from "react";
import { Trash2, Eye, EyeOff, Edit } from "lucide-react";
import { ROLE_COLORS } from "../../constants/appConstants";

function UserTable({ users, showPassword, onTogglePassword, onEdit, onDelete, onSearch }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-gradient-to-r from-indigo-600 to-blue-600">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Password
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-200">
            {users && users.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  Tidak ada data user
                </td>
              </tr>
            ) : (
              users && users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`hover:bg-gray-50 transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {/* ID */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{user.id}
                  </td>

                  {/* Username */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {user.username}
                      </span>
                    </div>
                  </td>

                  {/* Password */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700 font-mono">
                        {showPassword && showPassword[user.id] ? user.password : "••••••••"}
                      </span>
                      <button
                        onClick={() => onTogglePassword && onTogglePassword(user.id)}
                        className="text-gray-400 hover:text-gray-600 transition"
                      >
                        {showPassword && showPassword[user.id] ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                        ROLE_COLORS[user.role] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role === "admin" ? "👑 Admin" : "👤 User"}
                    </span>
                  </td>

                  {/* Created At */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>

                  {/* Aksi */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {/* Button Edit */}
                      <button
                        onClick={() => onEdit(user)}
                        className="inline-flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition shadow-sm"
                        title="Edit user"
                      >
                        <Edit size={16} />
                        Edit
                      </button>

                      {/* Button Delete */}
                      <button
                        onClick={() => onDelete(user.id)}
                        className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition shadow-sm"
                        title="Hapus user"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserTable;