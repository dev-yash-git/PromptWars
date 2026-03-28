import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('App Component', () => {
    test('renders the CivicFix AI brand name', () => {
        render(<App />);
        expect(screen.getByText('CivicFix')).toBeInTheDocument();
    });

    test('renders navigation links', () => {
        render(<App />);
        expect(screen.getByText('Reports')).toBeInTheDocument();
        expect(screen.getByText('Analytics')).toBeInTheDocument();
    });

    test('renders language toggle button', () => {
        render(<App />);
        expect(screen.getByText('EN')).toBeInTheDocument();
    });

    test('renders footer with copyright', () => {
        render(<App />);
        expect(screen.getByText(/Developed for Civic Resilience/i)).toBeInTheDocument();
    });
});
