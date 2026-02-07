import React from "react";
import { Search, Plus } from "lucide-react";

function SearchBar({ searchTerm, onSearchChange, onAddUser, loading }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Cari username atau role..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        {/* Add User Button */}
        <button
          onClick={onAddUser}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap"
        >
          <Plus size={20} />
          <span>Tambah User</span>
        </button>
      </div>
    </div>
  );
}

export default SearchBar;