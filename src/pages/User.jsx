import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import FormTambahUser from "../models/FormTambahUser";
import FormEditUser from "../models/FormEditUser";
import DeleteConfirmation from "../components/DeleteConfirmation";
import Toast from "../components/Toast";
import UserTable from "../components/user/UserTable";
import SearchBar from "../components/user/SearchBar";
import { 
  ambilSemuaUsers, 
  tambahUser, 
  editUser, 
  hapusUser 
} from "../services/userService";

function User() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState({});
  const [formUserVisible, setFormUserVisible] = useState(false);
  const [formEditVisible, setFormEditVisible] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Toast state
  const [toast, setToast] = useState({
    isOpen: false,
    type: "success",
    message: ""
  });
  
  // Form data untuk tambah user
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user",
  });

  // Form data untuk edit user
  const [editFormData, setEditFormData] = useState({
    id: null,
    username: "",
    password: "",
    role: "user",
  });

  const navigate = useNavigate();

  // ========== TOAST HELPER ==========

  const showToast = (type, message) => {
    setToast({
      isOpen: true,
      type,
      message
    });
  };

  const closeToast = () => {
    setToast({
      ...toast,
      isOpen: false
    });
  };

  // ========== DATA FETCHING ==========

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

  // ========== HELPER FUNCTIONS ==========

  // Fungsi logout
  const handleLogout = () => navigate("/login");

  // Toggle show/hide password
  const toggleLihatPassword = (userId) => {
    setShowPassword((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // ========== TAMBAH USER ==========
  
  // Buka form tambah user
  const bukaFormUser = () => setFormUserVisible(true);

  // Tutup form tambah user
  const tutupFormUser = () => {
    setFormUserVisible(false);
    setFormData({
      username: "",
      password: "",
      role: "user",
    });
  };

  // Handle perubahan input form tambah
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
        ambilDataUsers();
        tutupFormUser();
        showToast("success", "User berhasil ditambahkan!");
      } else {
        showToast("error", data.message || "Gagal menambahkan user");
      }
    } catch (error) {
      showToast("error", "Terjadi kesalahan saat menambahkan user");
    } finally {
      setLoading(false);
    }
  };

  // ========== EDIT USER ==========

  // Buka form edit user
  const bukaFormEdit = (user) => {
    setEditFormData({
      id: user.id,
      username: user.username,
      password: "",
      role: user.role,
    });
    setFormEditVisible(true);
  };

  // Tutup form edit user
  const tutupFormEdit = () => {
    setFormEditVisible(false);
    setEditFormData({
      id: null,
      username: "",
      password: "",
      role: "user",
    });
  };

  // Handle perubahan input form edit
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form edit user
  const simpanEditUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { id, username, password, role } = editFormData;
      
      const dataToSend = { username, role };
      if (password && password.trim() !== "") {
        dataToSend.password = password;
      }

      const result = await editUser(id, dataToSend);
      
      if (result.success) {
        ambilDataUsers();
        tutupFormEdit();
        showToast("success", "User berhasil diupdate!");
      } else {
        showToast("error", result.message || "Gagal mengupdate user");
      }
    } catch (error) {
      showToast("error", "Terjadi kesalahan saat mengupdate user");
    } finally {
      setLoading(false);
    }
  };

  // ========== HAPUS USER ==========

  // Buka delete confirmation modal
  const openDeleteModal = (userId) => {
    setUserToDelete(userId);
    setDeleteModalOpen(true);
  };

  // Tutup delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  // Confirm delete user
  const confirmDelete = async () => {
    if (!userToDelete) return;

    setLoading(true);
    try {
      const data = await hapusUser(userToDelete);
      if (data.success) {
        ambilDataUsers();
        closeDeleteModal();
        showToast("success", "User berhasil dihapus!");
      } else {
        showToast("error", data.message || "Gagal menghapus user");
      }
    } catch (error) {
      showToast("error", "Terjadi kesalahan saat menghapus user");
    } finally {
      setLoading(false);
    }
  };

  // ========== RENDER ==========

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
              onEdit={bukaFormEdit}
              onDelete={openDeleteModal}
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

      {/* Form Edit User */}
      <FormEditUser
        isOpen={formEditVisible}
        onClose={tutupFormEdit}
        formData={editFormData}
        onInputChange={handleEditInputChange}
        onSubmit={simpanEditUser}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />

      {/* Toast Notification */}
      <Toast
        isOpen={toast.isOpen}
        onClose={closeToast}
        type={toast.type}
        message={toast.message}
        duration={3000}
      />
    </div>
  );
}

export default User;