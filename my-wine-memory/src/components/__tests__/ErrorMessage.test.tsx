import { render, screen, fireEvent } from '@testing-library/react';
import ErrorMessage from '../ErrorMessage';

describe('ErrorMessage', () => {
  const defaultProps = {
    title: 'Test Error',
    message: 'This is a test error message',
  };

  it('renders error message with title and message', () => {
    render(<ErrorMessage {...defaultProps} />);
    
    expect(screen.getByText('Test Error')).toBeDefined();
    expect(screen.getByText('This is a test error message')).toBeDefined();
  });

  it('shows retry button when onRetry is provided and calls function on click', () => {
    const mockRetry = jest.fn();
    render(<ErrorMessage {...defaultProps} onRetry={mockRetry} />);
    
    const retryButton = screen.getByText('🔄 再試行');
    expect(retryButton).toBeDefined();
    
    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('renders with proper component structure', () => {
    render(<ErrorMessage {...defaultProps} />);
    
    const errorContainer = screen.getByText('Test Error').closest('div');
    expect(errorContainer).toBeDefined();
  });
});