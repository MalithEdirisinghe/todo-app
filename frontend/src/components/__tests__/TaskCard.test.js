import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskCard from '../TaskCard';

describe('TaskCard Component', () => {
    const mockTask = {
        id: 1,
        title: 'Sample Task',
        description: 'Sample Description',
        created_at: '2025-02-22T12:00:00.000Z'
    };

    const mockOnComplete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders task details correctly', () => {
        render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);

        expect(screen.getByText(mockTask.title)).toBeInTheDocument();
        expect(screen.getByText(mockTask.description)).toBeInTheDocument();
        expect(screen.getByText(/created:/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();
    });

    test('handles successful task completion', async () => {
        mockOnComplete.mockResolvedValueOnce();
        render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);

        const completeButton = screen.getByRole('button', { name: /done/i });
        fireEvent.click(completeButton);

        expect(completeButton).toBeDisabled();
        expect(screen.getByText('Marking...')).toBeInTheDocument();

        await waitFor(() => {
            expect(mockOnComplete).toHaveBeenCalledWith(mockTask.id);
            expect(completeButton).not.toBeDisabled();
            expect(screen.getByText('Done')).toBeInTheDocument();
        });
    });

    test('handles task completion error and displays error modal', async () => {
        mockOnComplete.mockRejectedValueOnce(new Error('Failed to complete task'));
        render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);

        fireEvent.click(screen.getByRole('button', { name: /done/i }));

        await waitFor(() => {
            expect(screen.getByText('Error')).toBeInTheDocument();
            expect(screen.getByText('Error completing task: Please try again')).toBeInTheDocument();
        });
    });

    test('maintains completing state during async operation', async () => {
        let resolvePromise;
        mockOnComplete.mockImplementationOnce(() => new Promise(resolve => {
            resolvePromise = resolve;
        }));

        render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);
        const completeButton = screen.getByRole('button', { name: /done/i });

        fireEvent.click(completeButton);
        expect(completeButton).toBeDisabled();
        expect(screen.getByText('Marking...')).toBeInTheDocument();

        resolvePromise();
        await waitFor(() => {
            expect(completeButton).not.toBeDisabled();
            expect(screen.getByText('Done')).toBeInTheDocument();
        });
    });

    test('closes error modal on button click', async () => {
        mockOnComplete.mockRejectedValueOnce(new Error('Failed to complete task'));
        render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);

        fireEvent.click(screen.getByRole('button', { name: /done/i }));

        await waitFor(() => {
            expect(screen.getByText('Error completing task: Please try again')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /close/i }));
        expect(screen.queryByText('Error completing task: Please try again')).not.toBeInTheDocument();
    });
});