import { render, screen, fireEvent } from '@testing-library/react';
import {Drawings} from './index';
import type { DrawingItem } from './drawings';

const mockDrawings: DrawingItem[] = [
  {
    name: 'Test Drawing',
    thumb: '/test-thumb.jpg',
    full: '/test-full.jpg',
  },
];

describe('Drawings Component', () => {
  it('renders full image overlay when hobbieImage is clicked', () => {
    render(<Drawings drawingsList={mockDrawings} drawingsHalloweenList={[]} />);
    // Find the thumbnail image and click it
    const thumbImg = screen.getByAltText(/Test Drawing/i);
    fireEvent.click(thumbImg);
    // The overlay should now be visible with the full image
    const fullImg = screen.getByAltText(/Full drawing/i);
    expect(fullImg).toBeInTheDocument();
    expect(fullImg).toHaveAttribute('src', '/test-full.jpg');
  });
});
