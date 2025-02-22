import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from '../TaskList';

describe('TaskList', () => {
  const mockTasks = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      created_at: new Date().toISOString()
    }
  ];

  test('renders empty state when no tasks', () => {
    render(<TaskList tasks={[]} onTaskComplete={() => {}} />);
    expect(screen.getByText(/no tasks to display/i)).toBeInTheDocument();
  });

  test('renders list of tasks', () => {
    render(<TaskList tasks={mockTasks} onTaskComplete={() => {}} />);

    mockTasks.forEach(task => {
      expect(screen.getByText(task.title)).toBeInTheDocument();
      expect(screen.getByText(task.description)).toBeInTheDocument();
    });
  });
});