import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
  it('renders with correct percentage', () => {
    render(<ProgressBar percentage={75} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
  });

  it('displays label when provided', () => {
    render(<ProgressBar percentage={50} label="Test Progress" />);
    expect(screen.getByText('Test Progress')).toBeInTheDocument();
  });

  it('shows percentage when showPercentage is true and label is provided', () => {
    render(<ProgressBar percentage={80} label="Progress" showPercentage={true} />);
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('clamps percentage to 0-100 range', () => {
    render(<ProgressBar percentage={150} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');
  });
});
