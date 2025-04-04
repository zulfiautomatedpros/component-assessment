"use client";
import React from "react";
import useForm from "./useForm";
import { ITodo } from "./TodoApp";
import { useTheme } from "./ThemeContext";

interface TodoFormValues {
  title: string;
  description: string;
  dueDate: string;
  category: string;
  priority: "Low" | "Medium" | "High";
}

interface TodoFormProps {
  initialData?: Partial<ITodo>;
  onSubmit: (data: Partial<ITodo>) => void;
  onCancel: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { theme } = useTheme();
  const validate = (values: TodoFormValues): Partial<TodoFormValues> => {
    const errors: Partial<TodoFormValues> = {};
    if (!values.title) errors.title = "Title is required";
    if (!values.dueDate) errors.dueDate = "Due date is required";
    return errors;
  };

  const { values, errors, touched, handleChange, handleSubmit, isSubmitting } =
    useForm<TodoFormValues>(
      {
        title: initialData?.title || "",
        description: initialData?.description || "",
        dueDate: initialData?.dueDate || "",
        category: initialData?.category || "",
        priority: (initialData?.priority as "Low" | "Medium" | "High") || "Medium",
      },
      validate
    );

  const formClass =
    theme === "dark"
      ? "space-y-4 border p-4 rounded bg-gray-800 text-white"
      : "space-y-4 border p-4 rounded bg-white text-black";

  const inputClass =
    theme === "dark"
      ? "border p-2 rounded w-full bg-gray-700 text-white placeholder-gray-300"
      : "border p-2 rounded w-full bg-white text-black placeholder-gray-500";

  return (
    <form
      onSubmit={(e) => handleSubmit(e, onSubmit)}
      className={formClass}
    >
      <h3 className="text-xl font-bold">
        {initialData ? "Edit To Do" : "Add To Do"}
      </h3>
      <div>
        <label className="block mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={values.title}
          onChange={handleChange}
          className={inputClass}
          required
        />
        {touched.title && errors.title && (
          <div className="text-red-500 text-sm">{errors.title}</div>
        )}
      </div>
      <div>
        <label className="block mb-1">Description</label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block mb-1">Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={values.dueDate}
          onChange={handleChange}
          className={inputClass}
          required
        />
        {touched.dueDate && errors.dueDate && (
          <div className="text-red-500 text-sm">{errors.dueDate}</div>
        )}
      </div>
      <div>
        <label className="block mb-1">Category</label>
        <input
          type="text"
          name="category"
          value={values.category}
          onChange={handleChange}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block mb-1">Priority</label>
        <select
          name="priority"
          value={values.priority}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {initialData ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TodoForm;
