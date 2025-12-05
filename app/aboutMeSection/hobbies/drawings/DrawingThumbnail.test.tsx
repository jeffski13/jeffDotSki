import { render, screen, fireEvent } from '@testing-library/react';
import { DrawingThumbail } from './DrawingThumbnail';

describe('Drawings Component', () => {
  it('component renders and functions correctly', () => {
    const drawingsList = [
      { name: 'MySpecialDrawing 1', thumb: '/thumb1.jpg', full: '/full1.jpg' },
    ];
    let wasClicked = false;
    render(<DrawingThumbail drawingItem={drawingsList[0]} index={0}
      isTestEnvInstantLoad={true} titleLabel="Mock Label"
      onImageClicked={() => {
        wasClicked = true;
      }}
    />);
    // Open overlay for Drawing 2
    const thumbImg = screen.getByAltText(/MySpecialDrawing 1 drawing/i);
    fireEvent.click(thumbImg);
    // click should register
    expect(wasClicked).toBe(true);
  });

  it('loading renders as expected', () => {
    const drawingsList = [
      { name: 'Drawing 1', thumb: '/thumb1.jpg', full: '/full1.jpg' },
    ];
    render(<DrawingThumbail drawingItem={drawingsList[0]} index={0}
      isTestEnvInstantLoad={false} titleLabel="Mock Label"
      onImageClicked={() => {
      }}
    />);

    // Open overlay for Drawing 2
    const thumbImg = screen.getByAltText(/Drawing 1 drawing loading.../i);
    
  });
});
