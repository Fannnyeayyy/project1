import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import FormTambahUser from "../models/FormTambahUser";
import UserTable from "../components/user/UserTable";
import SearchBar from "../components/user/SearchBar";
import { ambilSemuaUsers, tambahUser, hapusUser } from "../services/userService";

function User() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState({});
  const [formUserVisible, setFormUserVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });
  const navigate = useNavigate();

  // Ambil data users dari database
  const ambilDataUsers = async () => {
    setLoading(true);
    try {
      const result = await ambilSemuaUsers();

    if (result.success) {
      setUsers(result.data);
    } else {
      setError(result.message);
    }
    } catch (error) {
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  // Load users saat halaman pertama dibuka
  useEffect(() => {
    ambilDataUsers();
  }, []);

  // Filter users berdasarkan pencarian
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fungsi logout
  const handleLogout = () => navigate("/login");

  // Toggle show/hide password
  const toggleLihatPassword = (userId) => {
    setShowPassword((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Buka form tambah user
  const bukaFormUser = () => setFormUserVisible(true);

  // Tutup form tambah user
  const tutupFormUser = () => {
    setFormUserVisible(false);
    setFormData({
      username: "",
      password: "",
      role: "User",
    });
  };

  // Handle perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form tambah user
  const simpanUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await tambahUser(formData);
      if (data.success) {
        ambilDataUsers(); // Refresh data
        tutupFormUser();  // Tutup form
        alert("User berhasil ditambahkan!");
      } else {
        alert(data.message || "Gagal menambahkan user");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menambahkan user");
    } finally {
      setLoading(false);
    }
  };

  // Hapus user
  const hapusUserById = async (userId) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;

    setLoading(true);
    try {
      const data = await hapusUser(userId);
      if (data.success) {
        ambilDataUsers(); // Refresh data
        alert("User berhasil dihapus!");
      } else {
        alert(data.message || "Gagal menghapus user");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menghapus user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onLogout={handleLogout} />

        <main className="flex-1 overflow-y-auto px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              User Management
            </h1>
            <p className="text-gray-600">
              Kelola akun pengguna dan hak akses
            </p>
          </div>

          {/* Pesan Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Search Bar */}
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onAddUser={bukaFormUser}
            loading={loading}
          />

          {/* Loading */}
          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Memuat data...</p>
            </div>
          )}

          {/* Tabel Users */}
          {!loading && (
            <UserTable
              users={filteredUsers}
              showPassword={showPassword}
              onTogglePassword={toggleLihatPassword}
              onDelete={hapusUserById}
            />
          )}
        </main>
      </div>

      {/* Form Tambah User */}
      <FormTambahUser
        isOpen={formUserVisible}
        onClose={tutupFormUser}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={simpanUser}
      />
    </div>
  );
}

export default User;