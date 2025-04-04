"use client";
import { useState, useEffect } from "react";
import UserList from "./UserList";
import UserProfile from "./UserProfile";
import UserForm from "./UserForm";
import ConfirmationDialog from "./ConfirmationDialog";
import { IUser } from "./types";
import { motion, AnimatePresence } from "framer-motion";
import useFetch from "./useFetch";

// Define a type for the fetched users (only the fields available from the API)
interface FetchedUser {
  id: number;
  name: string;
  email: string;
}

interface UserDashboardProps {
  users: IUser[];
  onUsersChange: (users: IUser[]) => void;
  onFormVisibilityChange: (visible: boolean) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({
  users,
  onUsersChange,
  onFormVisibilityChange,
}) => {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [confirmDelete, setConfirmDelete] = useState<{
    show: boolean;
    userId: number | null;
  }>({
    show: false,
    userId: null,
  });
  const [usingFetchedData, setUsingFetchedData] = useState(false);
  const {
    data: fetchedUsers,
    loading: fetchLoading,
    error: fetchError,
    refetch,
  } = useFetch<FetchedUser[]>("https://jsonplaceholder.typicode.com/users");
  const isMainPage = !showForm && !selectedUser;

  // Notify the parent about the form's visibility state
  useEffect(() => {
    onFormVisibilityChange(showForm);
  }, [showForm, onFormVisibilityChange]);

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
      const updatedUsers = users.map((u) =>
        u.id === editingUser.id ? { ...u, ...formData } : u
      );
      onUsersChange(updatedUsers);
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
      onUsersChange([...users, newUser]);
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
      if (!usingFetchedData) {
        onUsersChange(users.filter((user) => user.id !== confirmDelete.userId));
      }
      if (selectedUser && selectedUser.id === confirmDelete.userId) {
        setSelectedUser(null);
      }
    }
    setConfirmDelete({ show: false, userId: null });
  };

  const cancelDeleteUser = () => {
    setConfirmDelete({ show: false, userId: null });
  };

  const handleRefresh = () => {
    setUsingFetchedData(true);
    refetch();
  };

  const handleBackToOriginal = () => {
    setUsingFetchedData(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {!showForm && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h1 className="text-2xl font-bold">User Management Dashboard</h1>
          {isMainPage && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={toggleViewMode}
                className="bg-gray-600 dark:bg-gray-700 text-white px-4 py-2 rounded"
              >
                {viewMode === "card" ? "Switch to List View" : "Switch to Card View"}
              </button>
              <button
                onClick={handleAddUser}
                className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded"
              >
                Add User
              </button>
              {!usingFetchedData && (
                <button
                  onClick={handleRefresh}
                  className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded"
                  disabled={fetchLoading}
                >
                  {fetchLoading ? "Loading..." : "Refresh"}
                </button>
              )}
              {usingFetchedData && (
                <>
                  <button
                    onClick={handleRefresh}
                    className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={fetchLoading}
                  >
                    {fetchLoading ? "Loading..." : "Refresh"}
                  </button>
                  <button
                    onClick={handleBackToOriginal}
                    className="bg-gray-700 dark:bg-gray-800 text-white px-4 py-2 rounded"
                  >
                    Back to Original
                  </button>
                </>
              )}
            </div>
          )}
          {!isMainPage && (
            <button
              onClick={handleAddUser}
              className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded"
            >
              Add User
            </button>
          )}
        </div>
      )}
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <UserForm
              initialData={editingUser || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
            />
          </motion.div>
        ) : selectedUser ? (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <UserProfile
              user={selectedUser}
              onEdit={handleEditUser}
              onBack={() => setSelectedUser(null)}
            />
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {usingFetchedData ? (
              <>
                {fetchLoading && <div>Loading...</div>}
                {fetchError && <div>Error: {fetchError.message}</div>}
                {!fetchLoading && !fetchError && fetchedUsers && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fetchedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="p-4 border border-gray-300 dark:border-gray-700 rounded shadow-md bg-white dark:bg-gray-900 dark:text-white"
                      >
                        <h2 className="text-xl text-gray-600 dark:text-gray-300 font-bold mb-2">{user.name}</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                          <span className="font-semibold">Email:</span> {user.email}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <UserList
                users={users}
                viewMode={viewMode}
                onViewProfile={handleViewProfile}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
              />
            )}
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
