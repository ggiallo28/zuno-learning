import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EarlyStopDialog } from './EarlyStopDialog';

describe('EarlyStopDialog', () => {
  const mockOnContinue = vi.fn();
  const mockOnStop = vi.fn();

  beforeEach(() => {
    mockOnContinue.mockClear();
    mockOnStop.mockClear();
  });

  it('renders when open is true', () => {
    render(
      <EarlyStopDialog
        open={true}
        precisionPct={95}
        onContinue={mockOnContinue}
        onStop={mockOnStop}
      />
    );

    expect(screen.getByText('Precisione sufficiente')).toBeInTheDocument();
    expect(screen.getByText(/95%/)).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(
      <EarlyStopDialog
        open={false}
        precisionPct={95}
        onContinue={mockOnContinue}
        onStop={mockOnStop}
      />
    );

    expect(screen.queryByText('Precisione sufficiente')).not.toBeInTheDocument();
  });

  it('calls onContinue when continue button is clicked', () => {
    render(
      <EarlyStopDialog
        open={true}
        precisionPct={95}
        onContinue={mockOnContinue}
        onStop={mockOnStop}
      />
    );

    fireEvent.click(screen.getByText('Continua'));
    expect(mockOnContinue).toHaveBeenCalledTimes(1);
  });

  it('calls onStop when stop button is clicked', () => {
    render(
      <EarlyStopDialog
        open={true}
        precisionPct={95}
        onContinue={mockOnContinue}
        onStop={mockOnStop}
      />
    );

    fireEvent.click(screen.getByText('Termina ora'));
    expect(mockOnStop).toHaveBeenCalledTimes(1);
  });

  it('displays correct precision percentage', () => {
    render(
      <EarlyStopDialog
        open={true}
        precisionPct={87}
        onContinue={mockOnContinue}
        onStop={mockOnStop}
      />
    );

    expect(screen.getByText(/87%/)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <EarlyStopDialog
        open={true}
        precisionPct={95}
        onContinue={mockOnContinue}
        onStop={mockOnStop}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Precisione sufficiente')).toBeInTheDocument();
    expect(document.getElementById('early-stop-desc')).toBeInTheDocument();
  });
});