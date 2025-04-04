"use client";
import React from "react";
import { ITodo } from "./TodoApp";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";

interface TodoItemProps {
  todo: ITodo;
  onEdit: (todo: ITodo) => void;
  onStatusUpdate: (todoId: number, status: ITodo["status"]) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit, onStatusUpdate }) => {
  const { user } = useAuth();
  const { theme } = useTheme();

  // Role-based permissions:
  const canEditExisting =
    (user?.role === "Admin" && user.isActive) || user?.role === "Editor";
  const canUpdateStatus = true; // All roles can update status

  const containerClass =
    theme === "dark"
      ? "border p-4 rounded mb-4 bg-gray-800 text-white shadow"
      : "border p-4 rounded mb-4 bg-white text-black shadow";

  return (
    <div className={containerClass}>
      <h3 className="text-lg font-bold">{todo.title}</h3>
      <p>{todo.description}</p>
      <p>
        <strong>Due Date:</strong> {todo.dueDate}
      </p>
      <p>
        <strong>Category:</strong> {todo.category}
      </p>
      <p>
        <strong>Priority:</strong> {todo.priority}
      </p>
      <p>
        <strong>Status:</strong> {todo.status}
      </p>
      <div className="mt-2 flex gap-2">
        {canEditExisting && (
          <button
            onClick={() => onEdit(todo)}
            className="bg-yellow-500 text-white px-3 py-1 rounded"
          >
            Edit
          </button>
        )}
        {canUpdateStatus && (
          <select
            value={todo.status}
            onChange={(e) =>
              onStatusUpdate(todo.id, e.target.value as ITodo["status"])
            }
            className="border p-1 rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="Yet To Do">Yet To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Halted">Halted</option>
            <option value="Completed">Completed</option>
          </select>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
