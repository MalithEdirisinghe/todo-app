// src/components/__tests__/Modal.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal Component', () => {
    const defaultProps = {
        isOpen: true,
        onClose: jest.fn(),
        title: 'Test Modal',
        message: 'Test Message'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders modal with all elements when isOpen is true', () => {
        render(<Modal {...defaultProps} />);

        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Test Message')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    test('does not render when isOpen is false', () => {
        render(<Modal {...defaultProps} isOpen={false} />);
        expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });

    test('calls onClose when clicking the close button', () => {
        render(<Modal {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    test('calls onClose when clicking the overlay', () => {
        render(<Modal {...defaultProps} />);
        fireEvent.click(screen.getByText('Test Message').parentElement.parentElement);
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    test('does not call onClose when clicking modal content', () => {
        render(<Modal {...defaultProps} />);
        fireEvent.click(screen.getByText('Test Message').parentElement);
        expect(defaultProps.onClose).not.toHaveBeenCalled();
    });

    test('sets body overflow to hidden when modal opens', () => {
        render(<Modal {...defaultProps} />);
        expect(document.body.style.overflow).toBe('hidden');
    });

    test('resets body overflow when modal closes', () => {
        const { rerender } = render(<Modal {...defaultProps} />);
        expect(document.body.style.overflow).toBe('hidden');

        rerender(<Modal {...defaultProps} isOpen={false} />);
        expect(document.body.style.overflow).toBe('unset');
    });

    test('resets body overflow on unmount', () => {
        const { unmount } = render(<Modal {...defaultProps} />);
        expect(document.body.style.overflow).toBe('hidden');

        unmount();
        expect(document.body.style.overflow).toBe('unset');
    });
});