import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App'

describe('App Component', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    test('fetches and displays tasks successfully', async () => {
        const mockTasks = [{
            id: 1,
            title: 'Test Task',
            description: 'Test Description',
            created_at: new Date().toISOString()
        }];

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockTasks)
        });

        render(<App />);

        expect(screen.getByText('Loading tasks...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Test Task')).toBeInTheDocument();
        });
    });

    test('handles task fetch error', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        global.fetch.mockRejectedValueOnce(new Error('API Error'));

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Failed to fetch tasks')).toBeInTheDocument();
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        consoleErrorSpy.mockRestore();
    });

    test('handles task completion successfully', async () => {
        const mockTasks = [{
            id: 1,
            title: 'Test Task',
            description: 'Test Description',
            created_at: new Date().toISOString()
        }];

        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockTasks)
            })
            .mockResolvedValueOnce({
                ok: true
            });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Test Task')).toBeInTheDocument();
        });

        const completeButton = screen.getByRole('button', { name: /done/i });
        await userEvent.click(completeButton);

        await waitFor(() => {
            expect(screen.queryByText('Test Task')).not.toBeInTheDocument();
        });
    });

    test('handles task completion error', async () => {
        const mockTasks = [{
            id: 1,
            title: 'Test Task',
            description: 'Test Description',
            created_at: new Date().toISOString()
        }];

        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockTasks)
            })
            .mockRejectedValueOnce(new Error('Failed to complete'));

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Test Task')).toBeInTheDocument();
        });

        const completeButton = screen.getByRole('button', { name: /done/i });
        await userEvent.click(completeButton);

        await waitFor(() => {
            expect(screen.getByText('Failed to complete task')).toBeInTheDocument();
        });
    });

    test('handles new task creation successfully', async () => {
        const mockTasks = [];
        const newTask = {
            id: 1,
            title: 'New Task',
            description: 'New Description',
            created_at: new Date().toISOString()
        };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockTasks)
        });

        render(<App />);
        
        await waitFor(() => {
            expect(screen.queryByText('Loading tasks...')).not.toBeInTheDocument();
        });

        const handleTaskCreated = jest.fn();
        const taskForm = screen.getByTestId('task-form');
        taskForm.onTaskCreated = handleTaskCreated;
        handleTaskCreated(newTask);

        await waitFor(() => {
            expect(handleTaskCreated).toHaveBeenCalledWith(newTask);
        });
    });

    test('handles task creation and updates state correctly', async () => {
        
        const initialTasks = [
            { id: 1, title: 'Task 1', description: 'Description 1', created_at: new Date().toISOString() },
            { id: 2, title: 'Task 2', description: 'Description 2', created_at: new Date().toISOString() },
            { id: 3, title: 'Task 3', description: 'Description 3', created_at: new Date().toISOString() },
            { id: 4, title: 'Task 4', description: 'Description 4', created_at: new Date().toISOString() },
            { id: 5, title: 'Task 5', description: 'Description 5', created_at: new Date().toISOString() }
        ];

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(initialTasks)
        });

        const newTask = {
            id: 6,
            title: 'New Task',
            description: 'New Description',
            created_at: new Date().toISOString()
        };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(newTask)
        });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Task 1')).toBeInTheDocument();
        });

        await userEvent.type(screen.getByPlaceholderText('Enter task title'), newTask.title);
        await userEvent.type(screen.getByPlaceholderText('Enter task description'), newTask.description);
        await userEvent.click(screen.getByRole('button', { name: /create task/i }));

        // Verify that the new task is added at the beginning
        await waitFor(() => {
            expect(screen.getByText(newTask.title)).toBeInTheDocument();
        });

        // Verify that only 5 tasks are shown and the oldest task is removed
        expect(screen.getByText('Task 4')).toBeInTheDocument();
        expect(screen.queryByText('Task 5')).not.toBeInTheDocument();

        // Verify the order of tasks (new task should be first)
        const taskElements = screen.getAllByRole('heading', { level: 3 });
        expect(taskElements[0]).toHaveTextContent(newTask.title);
        expect(taskElements[1]).toHaveTextContent('Task 1');
    });
});