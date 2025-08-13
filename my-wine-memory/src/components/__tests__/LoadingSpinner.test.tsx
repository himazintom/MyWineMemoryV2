import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders loading spinner with default message', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('データを読み込み中...')).toBeInTheDocument();
  });

  it('renders loading spinner with custom message', () => {
    const customMessage = 'カスタムメッセージ';
    render(<LoadingSpinner message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('renders loading spinner with small size', () => {
    render(<LoadingSpinner size="small" />);
    const spinner = screen.getByText('データを読み込み中...').closest('div');
    expect(spinner).toHaveClass('loading-spinner', 'small');
  });

  it('renders loading spinner with medium size by default', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByText('データを読み込み中...').closest('div');
    expect(spinner).toHaveClass('loading-spinner', 'medium');
  });
});