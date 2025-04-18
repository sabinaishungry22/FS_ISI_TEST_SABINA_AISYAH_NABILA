import React, { useState, useEffect } from 'react';

function TodoForm({ onAddTask, onUpdateTask, onCancelEdit, editingTodo }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title || '');
      setDescription(editingTodo.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editingTodo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      if (editingTodo) {
        onUpdateTask({ id: editingTodo.id, title, description });
      } else {
        onAddTask({ title, description });
      }
      setTitle('');
      setDescription('');
    }
  };

  const handleCancel = () => {
    onCancelEdit();
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border-transparent rounded-xl max-w-md mx-auto **w-96 h-auto**">
  <div> {/* Container for the label and input */}
    <label htmlFor="taskTitle" className="block text-black text-sm mb-1">
      Title
    </label>
    <input
      type="text"
      className="w-full p-2 border rounded-xl mb-2 border-gray-300"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      id="taskTitle"
    />
  </div>

  {editingTodo ? (
    <div className="flex gap-2 justify-center">
      <button
        type="submit"
        className="!bg-orange-300 text-black py-2 px-4 rounded-xl"
      >
        Update Task
      </button>
      <button
        type="button"
        className="!bg-red-400 text-black py-2 px-4 rounded-xl"
        onClick={handleCancel}
      >
        Cancel
      </button>
    </div>
  ) : (
    <div className="flex justify-center">
      <button className="!bg-blue-300 text-black py-2 px-4 rounded-xl">
        Add Task
      </button>
    </div>
  )}
</form>
  );
}

export default TodoForm;