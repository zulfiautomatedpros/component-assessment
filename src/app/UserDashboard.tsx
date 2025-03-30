"use client";
import { useState, useEffect } from "react";
import UserList from "./UserList";
import UserProfile from "./UserProfile";
import UserForm from "./UserForm";
import ConfirmationDialog from "./ConfirmationDialog";
import { IUser } from "./types";
import { motion, AnimatePresence } from "framer-motion";

interface UserDashboardProps {
  initialUsers: IUser[];
}

const UserDashboard: React.FC<UserDashboardProps> = ({ initialUsers }) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [confirmDelete, setConfirmDelete] = useState<{ show: boolean; userId: number | null }>({ show: false, userId: null });

  // Load users from local storage or use the initial data
  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(initialUsers);
    }
  }, [initialUsers]);

  // Persist users to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "card" ? "list" : "card"));
  };

  const handleViewProfile = (user: IUser) => {
    setSelectedUser(user);
    setShowForm(false);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user: IUser) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleFormSubmit = (formData: Partial<IUser>) => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)));
      setSelectedUser({ ...editingUser, ...formData });
    } else {
      const newUser: IUser = {
        id: Date.now(),
        name: formData.name || "",
        email: formData.email || "",
        role: (formData.role as "Admin" | "Editor" | "Viewer") || "Viewer",
        isActive: formData.isActive || false,
        avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
        department: "New",
        location: "Unknown",
        joinDate: new Date().toISOString().slice(0, 10),
      };
      setUsers([...users, newUser]);
    }
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleDeleteUser = (userId: number) => {
    setConfirmDelete({ show: true, userId });
  };

  const confirmDeleteUser = () => {
    if (confirmDelete.userId !== null) {
      setUsers(users.filter((user) => user.id !== confirmDelete.userId));
      if (selectedUser && selectedUser.id === confirmDelete.userId) {
        setSelectedUser(null);
      }
    }
    setConfirmDelete({ show: false, userId: null });
  };

  const cancelDeleteUser = () => {
    setConfirmDelete({ show: false, userId: null });
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {!showForm && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h1 className="text-2xl font-bold">User Management Dashboard</h1>
          {selectedUser ? (
            <button onClick={handleAddUser} className="bg-green-500 text-white px-4 py-2 rounded">
              Add User
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={toggleViewMode} className="bg-gray-600 text-white px-4 py-2 rounded">
                {viewMode === "card" ? "Switch to List View" : "Switch to Card View"}
              </button>
              <button onClick={handleAddUser} className="bg-green-500 text-white px-4 py-2 rounded">
                Add User
              </button>
            </div>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <UserForm initialData={editingUser || undefined} onSubmit={handleFormSubmit} onCancel={handleCancelForm} />
          </motion.div>
        ) : selectedUser ? (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <UserProfile user={selectedUser} onEdit={handleEditUser} onBack={() => setSelectedUser(null)} />
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <UserList
              users={users}
              viewMode={viewMode}
              onViewProfile={handleViewProfile}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {confirmDelete.show && (
        <ConfirmationDialog
          message="Are you sure you want to delete this user?"
          onConfirm={confirmDeleteUser}
          onCancel={cancelDeleteUser}
        />
      )}
    </div>
  );
};

export default UserDashboard;
