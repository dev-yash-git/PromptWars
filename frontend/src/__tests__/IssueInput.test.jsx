import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import IssueInput from '../components/IssueInput';

// Mock the custom hooks
vi.mock('../hooks/useSpeechToText', () => ({
    useSpeechToText: () => ({
        isListening: false,
        transcript: '',
        startListening: vi.fn(),
        stopListening: vi.fn(),
    }),
}));

vi.mock('../hooks/useGeolocation', () => ({
    useGeolocation: () => ({
        location: { lat: 12.97, lng: 77.59 },
        error: null,
    }),
}));

describe('IssueInput Component', () => {
    const mockOnAnalyze = vi.fn();

    test('renders the input form with all elements', () => {
        render(<IssueInput onAnalyze={mockOnAnalyze} isLoading={false} />);

        expect(screen.getByText('Report a Civic Issue')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Describe what's wrong/i)).toBeInTheDocument();
        expect(screen.getByText('Voice')).toBeInTheDocument();
        expect(screen.getByText('Image')).toBeInTheDocument();
        expect(screen.getByText('Analyze Issue')).toBeInTheDocument();
    });

    test('shows location status when geolocation is available', () => {
        render(<IssueInput onAnalyze={mockOnAnalyze} isLoading={false} />);
        expect(screen.getByText('Located')).toBeInTheDocument();
    });

    test('disables submit button when loading', () => {
        render(<IssueInput onAnalyze={mockOnAnalyze} isLoading={true} />);
        const btn = screen.getByText('Analyzing...');
        expect(btn.closest('button')).toBeDisabled();
    });

    test('shows inline error when submitting empty description', () => {
        render(<IssueInput onAnalyze={mockOnAnalyze} isLoading={false} />);

        fireEvent.click(screen.getByText('Analyze Issue'));
        expect(screen.getByRole('alert')).toHaveTextContent('Please provide a description of the issue.');
    });

    test('calls onAnalyze with FormData when description is provided', () => {
        render(<IssueInput onAnalyze={mockOnAnalyze} isLoading={false} />);

        const textarea = screen.getByPlaceholderText(/Describe what's wrong/i);
        fireEvent.change(textarea, { target: { value: 'Broken street light on 5th avenue' } });
        fireEvent.click(screen.getByText('Analyze Issue'));

        expect(mockOnAnalyze).toHaveBeenCalled();
        const formData = mockOnAnalyze.mock.calls[0][0];
        expect(formData).toBeInstanceOf(FormData);
        expect(formData.get('description')).toBe('Broken street light on 5th avenue');
    });
});
