//import React from "react";
//import TaskList from "./components/TaskList";
//import "./index.css";

import React, { useState, useEffect } from 'react';
import TodoForm from './components/TaskForm';
import TodoList from './components/TaskList';

const API_URL = 'http://localhost:8000/api/todos/';

function App() {
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleAddTask = async (newTodo) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTodos((prevTodos) => [...prevTodos, data]); // Correct way to update state
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleUpdateTask = async (updatedTodo) => {
    try {
      const response = await fetch(`${API_URL}${updatedTodo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === updatedTodo.id ? data : todo))
      );
      setEditingTodo(null);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}${id}`, {
        method: 'DELETE',
      });
      if (!response.ok && response.status !== 204) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const response = await fetch(`${API_URL}${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? data : todo))
      );
    } catch (error) {
      console.error('Error toggling complete:', error);
    }
  };

  const handleEditTask = (todo) => {
    setEditingTodo(todo);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const ongoingTasks = todos.filter((todo) => !todo.completed).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  const completedTasks = todos.filter((todo) => todo.completed).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto p-6 bg-white shadow-md rounded-md"> {/* This container centers its content */}
        <h1 className="text-4xl mb-4 text-center">Task Management</h1>
  
        <TodoForm
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onCancelEdit={handleCancelEdit}
          editingTodo={editingTodo}
        />
  
        <TodoList
          title="Ongoing Task"
          todos={ongoingTasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
  
        <TodoList
          title="Completed Task"
          todos={completedTasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      </div>
    </div>
  );
}

export default App;