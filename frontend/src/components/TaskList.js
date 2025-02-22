import React from 'react';
import TaskCard from './TaskCard';
import '../styles/TaskList.css';

const TaskList = ({ tasks, onTaskComplete }) => {
  if (tasks.length === 0) {
    return (
      <div className="task-list-container">
        <h2 className="task-list-title">List of Tasks</h2>
        <div className="no-tasks">
          No tasks to display
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <h2 className="task-list-title">List of Tasks</h2>
      <div className="task-count">
        Showing {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
      </div>
      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={onTaskComplete}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;