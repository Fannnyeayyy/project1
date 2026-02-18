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
import { ambilSemuaUsers, tambahUser, editUser, hapusUser } from "../services/userService";

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
  const [toast, setToast] = useState({ isOpen: false, type: "success", message: "" });
  const [formData, setFormData] = useState({ username: "", password: "", role: "user" });
  const [editFormData, setEditFormData] = useState({ id: null, username: "", password: "", role: "user" });
  const navigate = useNavigate();

  const showToast = (type, message) => setToast({ isOpen: true, type, message });
  const closeToast = () => setToast(prev => ({ ...prev, isOpen: false }));

  const ambilDataUsers = async () => {
    setLoading(true);
    try {
      const result = await ambilSemuaUsers();
      if (result.success) setUsers(result.data);
      else setError(result.message);
    } catch { setError("Terjadi kesalahan saat mengambil data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { ambilDataUsers(); }, []);

  const filteredUsers = users.filter(
    u => u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
         u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleLihatPassword = (id) => setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));

  const tutupFormUser = () => { setFormUserVisible(false); setFormData({ username: "", password: "", role: "user" }); };
  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const simpanUser = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const data = await tambahUser(formData);
      if (data.success) { ambilDataUsers(); tutupFormUser(); showToast("success", "User berhasil ditambahkan!"); }
      else showToast("error", data.message || "Gagal menambahkan user");
    } catch { showToast("error", "Terjadi kesalahan"); }
    finally { setLoading(false); }
  };

  const bukaFormEdit = (user) => { setEditFormData({ id: user.id, username: user.username, password: "", role: user.role }); setFormEditVisible(true); };
  const tutupFormEdit = () => { setFormEditVisible(false); setEditFormData({ id: null, username: "", password: "", role: "user" }); };
  const handleEditInputChange = (e) => { const { name, value } = e.target; setEditFormData(prev => ({ ...prev, [name]: value })); };
  const simpanEditUser = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { id, username, password, role } = editFormData;
      const dataToSend = { username, role };
      if (password?.trim()) dataToSend.password = password;
      const result = await editUser(id, dataToSend);
      if (result.success) { ambilDataUsers(); tutupFormEdit(); showToast("success", "User berhasil diupdate!"); }
      else showToast("error", result.message || "Gagal mengupdate user");
    } catch { showToast("error", "Terjadi kesalahan"); }
    finally { setLoading(false); }
  };

  const openDeleteModal = (id) => { setUserToDelete(id); setDeleteModalOpen(true); };
  const closeDeleteModal = () => { setDeleteModalOpen(false); setUserToDelete(null); };
  const confirmDelete = async () => {
    if (!userToDelete) return;
    setLoading(true);
    try {
      const data = await hapusUser(userToDelete);
      if (data.success) { ambilDataUsers(); closeDeleteModal(); showToast("success", "User berhasil dihapus!"); }
      else showToast("error", data.message || "Gagal menghapus user");
    } catch { showToast("error", "Terjadi kesalahan"); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex h-screen" style={{ background: "#f1f5f9" }}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto px-7 py-6 flex flex-col">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "#1e293b" }}>User Management</h1>
            <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>Kelola akun pengguna dan hak akses</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium" style={{ background: "#fee2e2", color: "#ef4444", border: "1px solid #fecaca" }}>
              {error}
            </div>
          )}

          {/* Table Card */}
          <div className="bg-white rounded-xl flex flex-col flex-1 min-h-0" style={{ border: "1px solid #e2e8f0" }}>
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={(e) => setSearchTerm(e.target.value)}
              onAddUser={() => setFormUserVisible(true)}
              loading={loading}
              total={filteredUsers.length}
            />

            {loading ? (
              <div className="flex-1 flex items-center justify-center text-sm" style={{ color: "#94a3b8" }}>
                Memuat data...
              </div>
            ) : (
              <UserTable
                users={filteredUsers}
                showPassword={showPassword}
                onTogglePassword={toggleLihatPassword}
                onEdit={bukaFormEdit}
                onDelete={openDeleteModal}
              />
            )}
          </div>
        </main>
      </div>

      <FormTambahUser isOpen={formUserVisible} onClose={tutupFormUser} formData={formData} onInputChange={handleInputChange} onSubmit={simpanUser} />
      <FormEditUser isOpen={formEditVisible} onClose={tutupFormEdit} formData={editFormData} onInputChange={handleEditInputChange} onSubmit={simpanEditUser} />
      <DeleteConfirmation isOpen={deleteModalOpen} onClose={closeDeleteModal} onConfirm={confirmDelete} />
      <Toast isOpen={toast.isOpen} onClose={closeToast} type={toast.type} message={toast.message} duration={3000} />
    </div>
  );
}

export default User;