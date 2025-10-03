import { render, screen, fireEvent } from '@testing-library/react';
import WineCard from '../WineCard';
import type { WineRecord } from '../../types';

const mockWineRecord: WineRecord = {
  // WineMaster fields
  id: 'wine123',
  wineName: 'Test Wine',
  producer: 'Test Producer',
  country: 'France',
  region: 'Bordeaux',
  vintage: 2020,
  grapeVarieties: ['Cabernet Sauvignon', 'Merlot'],
  wineType: 'red',
  createdAt: new Date('2023-01-15'),
  createdBy: 'user123',
  referenceCount: 1,
  updatedAt: new Date('2023-01-15'),

  // TastingRecord fields
  recordId: 'record123',
  userId: 'user123',
  overallRating: 8.5,
  tastingDate: new Date('2023-01-15'),
  recordMode: 'quick',
  notes: 'Great wine with excellent balance',
  isPublic: false,
};

describe('WineCard', () => {
  it('renders wine card component', () => {
    render(<WineCard wine={mockWineRecord} />);
    
    // Basic component rendering test
    expect(screen.getByText('Test Wine')).toBeDefined();
  });

  it('calls onClick when provided', () => {
    const mockOnClick = jest.fn();
    render(<WineCard wine={mockWineRecord} onClick={mockOnClick} />);
    
    const card = screen.getByText('Test Wine').closest('div');
    if (card) {
      fireEvent.click(card);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    }
  });

  it('renders wine producer information', () => {
    render(<WineCard wine={mockWineRecord} />);
    
    expect(screen.getByText('Test Producer')).toBeDefined();
  });
});