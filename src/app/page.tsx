"use client";
import { AuthProvider, useAuth } from "./AuthContext";
import { ThemeProvider, useTheme } from "./ThemeContext";
import UserDashboard from "./UserDashboard";
import LoginPage from "./LoginPage";
import TodoApp from "./TodoApp";
import { IUser } from "./types";
import { useState } from "react";

const initialUsers: IUser[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    role: "Admin",
    department: "IT",
    location: "New York",
    joinDate: "2020-01-15",
    isActive: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    role: "Editor",
    department: "Content",
    location: "Los Angeles",
    joinDate: "2021-03-20",
    isActive: true,
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    role: "Viewer",
    department: "Marketing",
    location: "Chicago",
    joinDate: "2019-11-05",
    isActive: false,
  },
  {
    id: 4,
    name: "Sara Williams",
    email: "sara@example.com",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    role: "Editor",
    department: "Design",
    location: "Seattle",
    joinDate: "2022-05-10",
    isActive: true,
  },
  {
    id: 5,
    name: "Mike Brown",
    email: "mike@example.com",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    role: "Viewer",
    department: "Sales",
    location: "Boston",
    joinDate: "2021-08-15",
    isActive: false,
  },
];

function Header({
  onToggleTodo,
  todoButtonLabel,
  showTodoButton,
}: {
  onToggleTodo: () => void;
  todoButtonLabel: string;
  showTodoButton: boolean;
}) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="absolute top-4 right-4 flex gap-2 z-50">
      <button onClick={toggleTheme} className="bg-gray-700 text-white px-4 py-2 rounded">
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </button>
      {showTodoButton && (
        <button onClick={onToggleTodo} className="bg-blue-500 text-white px-4 py-2 rounded">
          {todoButtonLabel}
        </button>
      )}
      {user && (
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      )}
    </header>
  );
}

function MainContent() {
  const [users, setUsers] = useState<IUser[]>(initialUsers);
  const { user } = useAuth();
  const [showTodo, setShowTodo] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);

  // Set the button label based on whether the Todo list is active
  const todoButtonLabel = showTodo ? "Back to Dashboard" : "To Do List";
  // Hide the Todo button on the login screen and when the Add User Form is visible
  const showTodoButton = !!user && !showUserForm;

  return (
    <ThemeProvider>
      <div className="min-h-screen relative">
        <Header 
          onToggleTodo={() => setShowTodo((prev) => !prev)}
          todoButtonLabel={todoButtonLabel}
          showTodoButton={showTodoButton}
        />
        <div className="pt-20">
          {!user ? (
            <LoginPage users={users} />
          ) : showTodo ? (
            <main className="p-8">
              <TodoApp />
            </main>
          ) : (
            <main className="p-8">
              <UserDashboard 
                users={users} 
                onUsersChange={setUsers} 
                onFormVisibilityChange={setShowUserForm}
              />
            </main>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default function HomePage() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
