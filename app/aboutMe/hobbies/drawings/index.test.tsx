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
  it('switches full screen image with left/right arrow keys', () => {
    const drawingsList = [
      { name: 'Drawing 1', thumb: '/thumb1.jpg', full: '/full1.jpg' },
      { name: 'Drawing 2', thumb: '/thumb2.jpg', full: '/full2.jpg' },
      { name: 'Drawing 3', thumb: '/thumb3.jpg', full: '/full3.jpg' },
    ];
    render(<Drawings drawingsList={drawingsList} drawingsHalloweenList={[]} />);
    // Open overlay for Drawing 2
    const thumbImg = screen.getByAltText(/Drawing 2 Drawing/i);
    fireEvent.click(thumbImg);
    // Overlay should show Drawing 2
    let fullImg = screen.getByAltText(/Full drawing/i);
    expect(fullImg).toHaveAttribute('src', '/full2.jpg');

    // Press right arrow to go to Drawing 3
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fullImg = screen.getByAltText(/Full drawing/i);
    expect(fullImg).toHaveAttribute('src', '/full3.jpg');

    // Press left arrow to go back to Drawing 2
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    fullImg = screen.getByAltText(/Full drawing/i);
    expect(fullImg).toHaveAttribute('src', '/full2.jpg');

    // Press left arrow to go to Drawing 1
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    fullImg = screen.getByAltText(/Full drawing/i);
    expect(fullImg).toHaveAttribute('src', '/full1.jpg');
  });
  
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

  it('renders correct number of drawings from both lists', () => {
    const drawingsList = [
      { name: 'NormalDrawing 1', thumb: '/thumb1.jpg', full: '/full1.jpg' },
      { name: 'NormalDrawing 2', thumb: '/thumb2.jpg', full: '/full2.jpg' },
    ];
    const drawingsHalloweenList = [
      { name: 'VerySpooky 1', thumb: '/spooky1.jpg', full: '/spookyfull1.jpg' },
      { name: 'VerySpooky 2', thumb: '/spooky2.jpg', full: '/spookyfull2.jpg' },
      { name: 'VerySpooky 3', thumb: '/spooky3.jpg', full: '/spookyfull3.jpg' },
    ];
    render(<Drawings drawingsList={drawingsList} drawingsHalloweenList={drawingsHalloweenList} />);
    // All images should be rendered
    const allImages = screen.getAllByRole('img');
    // There may be other images (e.g. overlay), so filter by alt text containing 'Drawing' or 'Spooky'
    const drawingImages = allImages.filter(img =>
      img.alt.includes('NormalDrawing')
    );
    const drawingImagesSpooky = allImages.filter(img =>
      img.alt.includes('VerySpooky')
    );
    expect(drawingImages.length).toBe(drawingsList.length);
    expect(drawingImagesSpooky.length).toBe(drawingsHalloweenList.length);
  });
});
