import React from 'react';
import { format } from 'date-fns';
import { Pencil, CircleX, CircleCheck, Circle } from 'lucide-react';

function TodoItem({ todo, onToggleComplete, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    try {
      const cleanedDateString = dateString.replace('+00:00', '');
      const date = new Date(cleanedDateString);
      if (isNaN(date)) {
        console.error("Error creating Date object:", dateString, "Cleaned:", cleanedDateString);
        return "Invalid Date";
      }
      return format(date, 'MMM d, yyyy HH:mm');
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "Invalid Date";
    }
  };

  return (
    <li className="my-4 px-4 flex justify-center">
      <div className="w-full max-w-2xl flex items-center justify-between p-4 border rounded-xl bg-gray-300 ">
        <div className="flex-1">
          <span className={todo.completed ? 'line-through text-black' : 'text-black'}>
            {todo.title}
          </span>
          <button onClick={() => onEdit(todo)} className="ml-3 text-black hover:text-black">
            <Pencil size={18} />
          </button>
          <p className="text-xs text-black">{formatDate(todo.created_at)}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onDelete(todo.id)} className="text-black hover:text-black">
            <CircleX size={18} />
          </button>
          <button onClick={() => onToggleComplete(todo.id, todo.completed)} className="mr-2">
            {todo.completed ? <CircleCheck size={20} className="text-black" /> : <Circle size={20} />}
          </button>
        </div>
      </div>
    </li>
  );
}

export default TodoItem;
