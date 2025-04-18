import React from 'react';
import TodoItem from './TaskItem';

function TodoList({ title, todos, onToggleComplete, onEdit, onDelete }) {
  return (
    <div className="**mt-1** p-4 rounded-xl max-w-md mx-auto">
      <h2 className="text-sm font-bold mb-2">{title}</h2>
      {todos.length === 0 ? (
        <p className="text-gray-500 text-center">No {title.toLowerCase()}.</p>
      ) : (
        <ul className="space-y-2 **block**"> {/* Ensure it's a block element */}
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;