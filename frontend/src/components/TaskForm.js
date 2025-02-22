import React, { useState } from 'react';
import Modal from './Modal';
import '../styles/TaskForm.css';

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setError('Please fill in all fields');
      setIsModalOpen(true);
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('http://localhost:8000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      const data = await response.json();
      onTaskCreated(data);
      setTitle('');
      setDescription('');
      setError('');
    } catch (err) {
      setError('Failed to create task');
      setIsModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="task-form" data-testid="task-form">
      <h2>Create New Task</h2>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Error"
        message={error}
      />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            disabled={submitting}
          />
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          className={`submit-button ${submitting ? 'button-disabled' : ''}`}
        >
          {submitting ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;