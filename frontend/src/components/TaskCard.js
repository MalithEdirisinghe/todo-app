import React, { useState } from 'react';
import Modal from './Modal';
import '../styles/TaskCard.css';

const TaskCard = ({ task, onComplete }) => {
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleComplete = async () => {
    try {
      setCompleting(true);
      await onComplete(task.id);
    } catch (error) {
      setError('Error completing task: Please try again');
      setIsModalOpen(true);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="task-card">
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Error"
        message={error}
      />

      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <button
          onClick={handleComplete}
          disabled={completing}
          className={`complete-button ${completing ? 'completing' : ''}`}
        >
          {completing ? 'Marking...' : 'Done'}
        </button>
      </div>
      
      <p className="task-description">{task.description}</p>
      
      <div className="task-date">
        Created: {new Date(task.created_at).toLocaleString()}
      </div>
    </div>
  );
};

export default TaskCard;