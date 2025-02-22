import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../TaskForm';

describe('TaskForm Component', () => {
  const mockOnTaskCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  test('renders form elements correctly', () => {
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter task description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Task' })).toBeInTheDocument();
  });

  test('handles failed API response', async () => {
    global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Server error'))
    });

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    await userEvent.type(screen.getByPlaceholderText('Enter task title'), 'Test Task');
    await userEvent.type(screen.getByPlaceholderText('Enter task description'), 'Test Description');

    fireEvent.click(screen.getByRole('button', { name: 'Create Task' }));

    await waitFor(() => {
        expect(screen.getByText('Failed to create task')).toBeInTheDocument();
        expect(mockOnTaskCreated).not.toHaveBeenCalled();
    });

    expect(screen.getByRole('button', { name: 'Create Task' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Create Task' })).toHaveTextContent('Create Task');
});

  test('validates empty form fields and shows error modal', async () => {
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    fireEvent.click(screen.getByRole('button', { name: 'Create Task' }));

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    });
  });

  test('validates form with only whitespace and shows error modal', async () => {
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    await userEvent.type(screen.getByPlaceholderText('Enter task title'), '   ');
    await userEvent.type(screen.getByPlaceholderText('Enter task description'), '   ');

    fireEvent.click(screen.getByRole('button', { name: 'Create Task' }));

    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    });
  });

  test('successfully creates a task and resets form', async () => {
    const mockTask = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      created_at: new Date().toISOString()
    };

    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockTask)
    });

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    await userEvent.type(screen.getByPlaceholderText('Enter task title'), mockTask.title);
    await userEvent.type(screen.getByPlaceholderText('Enter task description'), mockTask.description);

    const submitButton = screen.getByRole('button', { name: 'Create Task' });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Creating...')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockOnTaskCreated).toHaveBeenCalledWith(mockTask);
      expect(screen.getByPlaceholderText('Enter task title')).toHaveValue('');
      expect(screen.getByPlaceholderText('Enter task description')).toHaveValue('');
      expect(submitButton).not.toBeDisabled();
      expect(screen.getByText('Create Task')).toBeInTheDocument();
    });
  });

  test('handles API error during task creation', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    await userEvent.type(screen.getByPlaceholderText('Enter task title'), 'Test Task');
    await userEvent.type(screen.getByPlaceholderText('Enter task description'), 'Test Description');

    fireEvent.click(screen.getByRole('button', { name: 'Create Task' }));

    await waitFor(() => {
      expect(screen.getByText('Failed to create task')).toBeInTheDocument();
      expect(mockOnTaskCreated).not.toHaveBeenCalled();
    });
  });

  test('maintains form state during submission', async () => {
    let resolvePromise;
    global.fetch.mockImplementationOnce(() => new Promise(resolve => {
      resolvePromise = resolve;
    }));

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    await userEvent.type(screen.getByPlaceholderText('Enter task title'), 'Test Task');
    await userEvent.type(screen.getByPlaceholderText('Enter task description'), 'Test Description');

    fireEvent.click(screen.getByRole('button', { name: 'Create Task' }));

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveTextContent('Creating...');

    resolvePromise({ json: () => Promise.resolve({}) });

    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled();
      expect(screen.getByRole('button')).toHaveTextContent('Create Task');
    });
  });

  // New test for empty field validation (added to cover line 50)
  test('displays error when fields are empty and submit is clicked', async () => {
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    fireEvent.click(screen.getByRole('button', { name: 'Create Task' }));

    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    });
  });
});
