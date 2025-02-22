import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './styles/App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/tasks');
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskCreated = (newTask) => {
    setTasks(prevTasks => [newTask, ...prevTasks].slice(0, 5));
  };

  const handleTaskCompleted = async (taskId) => {
    try {
      await fetch(`http://localhost:8000/api/tasks/${taskId}/complete`, {
        method: 'PUT'
      });
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to complete task');
    }
  };

  return (
    <div className="app">
      <h1 className="app-title">Todo App</h1>
      
      <div className="app-content">
        <TaskForm onTaskCreated={handleTaskCreated} />
        
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <TaskList 
            tasks={tasks} 
            onTaskComplete={handleTaskCompleted} 
          />
        )}
      </div>
    </div>
  );
}

export default App;