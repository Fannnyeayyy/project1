import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import FormTambahUser from "../models/FormTambahUser";
import FormEditUser from "../models/Formedituser";
import DeleteConfirmation from "../components/DeleteConfirmation";
import Toast from "../components/Toast";
import UserTable from "../components/user/UserTable";
import SearchBar from "../components/user/SearchBar";
import { ambilSemuaUsers, tambahUser, editUser, hapusUser } from "../services/userService";

function User() {
  const [sidebarOpen, setSidebarOpen]         = useState(true);
  const [searchTerm, setSearchTerm]           = useState("");
  const [showPassword, setShowPassword]       = useState({});
  const [formUserVisible, setFormUserVisible] = useState(false);
  const [formEditVisible, setFormEditVisible] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete]       = useState(null);
  const [editData, setEditData]               = useState(null);
  const [users, setUsers]                     = useState([]);
  const [loading, setLoading]                 = useState(false);
  const [toast, setToast]                     = useState({ isOpen: false, type: "success", message: "" });
  const navigate = useNavigate();

  const showToast = (type, message) => setToast({ isOpen: true, type, message });
  const closeToast = () => setToast(prev => ({ ...prev, isOpen: false }));

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await ambilSemuaUsers();
      if (result.success) setUsers(result.data);
      else showToast("error", result.message);
    } catch { showToast("error", "Terjadi kesalahan saat mengambil data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleLihatPassword = (id) => setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));

  // ← Terima (data) dari FormTambahUser
  const simpanUser = async (data) => {
    setLoading(true);
    try {
      const result = await tambahUser(data);
      if (result.success) {
        fetchUsers();
        setFormUserVisible(false);
        showToast("success", "User berhasil ditambahkan!");
      } else {
        showToast("error", result.message || "Gagal menambahkan user");
      }
    } catch { showToast("error", "Terjadi kesalahan"); }
    finally { setLoading(false); }
  };

  const bukaFormEdit = (user) => { setEditData(user); setFormEditVisible(true); };
  const tutupFormEdit = () => { setFormEditVisible(false); setEditData(null); };

  // ← Terima (data, id) dari FormEditUser
  const simpanEditUser = async (data, id) => {
    setLoading(true);
    try {
      const result = await editUser(id, data);
      if (result.success) {
        fetchUsers();
        tutupFormEdit();
        showToast("success", "User berhasil diupdate!");
      } else {
        showToast("error", result.message || "Gagal mengupdate user");
      }
    } catch { showToast("error", "Terjadi kesalahan"); }
    finally { setLoading(false); }
  };

  const openDeleteModal  = (id) => { setUserToDelete(id); setDeleteModalOpen(true); };
  const closeDeleteModal = ()   => { setDeleteModalOpen(false); setUserToDelete(null); };
  const confirmDelete    = async () => {
    if (!userToDelete) return;
    setLoading(true);
    try {
      const result = await hapusUser(userToDelete);
      if (result.success) { fetchUsers(); closeDeleteModal(); showToast("success", "User berhasil dihapus!"); }
      else showToast("error", result.message || "Gagal menghapus user");
    } catch { showToast("error", "Terjadi kesalahan"); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex h-screen" style={{ background: "#f1f5f9" }}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-7 py-6 flex flex-col">
          <div className="mb-6">
            <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "#1e293b" }}>User Management</h1>
            <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>Kelola akun pengguna dan hak akses</p>
          </div>

          <div className="bg-white rounded-xl flex flex-col flex-1 min-h-0" style={{ border: "1px solid #e2e8f0" }}>
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={e => setSearchTerm(e.target.value)}
              onAddUser={() => setFormUserVisible(true)}
              loading={loading}
              total={filteredUsers.length}
            />
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-sm" style={{ color: "#94a3b8" }}>Memuat data...</div>
            ) : (
              <UserTable users={filteredUsers} showPassword={showPassword} onTogglePassword={toggleLihatPassword} onEdit={bukaFormEdit} onDelete={openDeleteModal} />
            )}
          </div>
        </main>
      </div>

      {/* ← Tidak lagi pass formData/onInputChange */}
      <FormTambahUser isOpen={formUserVisible} onClose={() => setFormUserVisible(false)} onSubmit={simpanUser} />
      <FormEditUser   isOpen={formEditVisible} onClose={tutupFormEdit} onSubmit={simpanEditUser} editData={editData} />
      <DeleteConfirmation isOpen={deleteModalOpen} onClose={closeDeleteModal} onConfirm={confirmDelete} />
      <Toast isOpen={toast.isOpen} onClose={closeToast} type={toast.type} message={toast.message} duration={3000} />
    </div>
  );
}

export default User;