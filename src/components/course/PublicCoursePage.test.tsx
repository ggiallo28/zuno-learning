import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { PublicCoursePage } from './PublicCoursePage';

// Simple test to verify the component renders without crashing
describe('PublicCoursePage', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <PublicCoursePage />
      </BrowserRouter>
    );
  };

  it('renders loading state initially', () => {
    renderComponent();
    
    // Check that loading state is displayed
    expect(screen.getByText('Loading course...')).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    expect(() => renderComponent()).not.toThrow();
  });
});