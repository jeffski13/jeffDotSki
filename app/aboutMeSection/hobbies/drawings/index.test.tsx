/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
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
    render(<Drawings drawingsList={drawingsList} drawingsHalloweenList={[]} isTestEnvInstantLoad={true} />);
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
  
  it('switches full screen image with the side arrow buttons', () => {
    const drawingsList = [
      { name: 'Drawing 1', thumb: '/thumb1.jpg', full: '/full1.jpg' },
      { name: 'Drawing 2', thumb: '/thumb2.jpg', full: '/full2.jpg' },
    ];
    render(<Drawings drawingsList={drawingsList} drawingsHalloweenList={[]} isTestEnvInstantLoad={true} />);
    fireEvent.click(screen.getByAltText(/Drawing 1 Drawing/i));

    fireEvent.click(screen.getByLabelText('Next drawing'));
    expect(screen.getByAltText(/Full drawing/i)).toHaveAttribute('src', '/full2.jpg');

    fireEvent.click(screen.getByLabelText('Previous drawing'));
    expect(screen.getByAltText(/Full drawing/i)).toHaveAttribute('src', '/full1.jpg');

    // Previous wraps around to the last drawing
    fireEvent.click(screen.getByLabelText('Previous drawing'));
    expect(screen.getByAltText(/Full drawing/i)).toHaveAttribute('src', '/full2.jpg');
  });

  it('side arrow buttons are hidden on small screens', () => {
    render(<Drawings drawingsList={mockDrawings} drawingsHalloweenList={[]} isTestEnvInstantLoad={true} />);
    fireEvent.click(screen.getByAltText(/Test Drawing/i));
    expect(screen.getByLabelText('Previous drawing')).toHaveClass('d-none', 'd-md-flex');
    expect(screen.getByLabelText('Next drawing')).toHaveClass('d-none', 'd-md-flex');
  });

  it('shows side arrow buttons as soon as the overlay opens, while the full image is loading', () => {
    render(<Drawings drawingsList={mockDrawings} drawingsHalloweenList={[]} />);
    fireEvent.click(screen.getByAltText(/Test Drawing/i));
    expect(screen.getByAltText(/Full drawing loading/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Previous drawing')).toBeInTheDocument();
    expect(screen.getByLabelText('Next drawing')).toBeInTheDocument();
  });

  it('keeps the same side arrow buttons mounted when switching drawings, so the intro animation only plays once', () => {
    const drawingsList = [
      { name: 'Drawing 1', thumb: '/thumb1.jpg', full: '/full1.jpg' },
      { name: 'Drawing 2', thumb: '/thumb2.jpg', full: '/full2.jpg' },
    ];
    render(<Drawings drawingsList={drawingsList} drawingsHalloweenList={[]} isTestEnvInstantLoad={true} />);
    fireEvent.click(screen.getByAltText(/Drawing 1 Drawing/i));
    const prevButton = screen.getByLabelText('Previous drawing');
    const nextButton = screen.getByLabelText('Next drawing');

    fireEvent.click(nextButton);
    expect(screen.getByAltText(/Full drawing/i)).toHaveAttribute('src', '/full2.jpg');
    expect(screen.getByLabelText('Previous drawing')).toBe(prevButton);
    expect(screen.getByLabelText('Next drawing')).toBe(nextButton);
  });

  it('clicking a side arrow does not close the overlay', () => {
    render(<Drawings drawingsList={mockDrawings} drawingsHalloweenList={[]} isTestEnvInstantLoad={true} />);
    fireEvent.click(screen.getByAltText(/Test Drawing/i));
    fireEvent.click(screen.getByLabelText('Next drawing'));
    expect(screen.getByAltText(/Full drawing/i)).toBeInTheDocument();
  });

  it('shows the close button above the left arrow on md+ and in the top bar on smaller screens', () => {
    render(<Drawings drawingsList={mockDrawings} drawingsHalloweenList={[]} isTestEnvInstantLoad={true} />);
    fireEvent.click(screen.getByAltText(/Test Drawing/i));
    const closeButtons = screen.getAllByLabelText('Close full screen image');
    expect(closeButtons).toHaveLength(2);

    const [smallScreenClose, mdScreenClose] = closeButtons;
    expect(smallScreenClose.parentElement).toHaveClass('fullImageDirectionClose', 'd-md-none');
    expect(mdScreenClose.parentElement).toHaveClass('fullImageFrameClose', 'd-none', 'd-md-flex');
    // The md+ close button shares the frame with the arrows
    expect(mdScreenClose.closest('.fullImageFrame')).toContainElement(screen.getByLabelText('Previous drawing'));
  });

  it.each([0, 1])('closes full image overlay from close button %i', (buttonIndex) => {
    render(<Drawings drawingsList={mockDrawings} drawingsHalloweenList={[]} isTestEnvInstantLoad={true} />);
    fireEvent.click(screen.getByAltText(/Test Drawing/i));
    fireEvent.click(screen.getAllByLabelText('Close full screen image')[buttonIndex]);
    expect(screen.queryByAltText(/Full drawing/i)).not.toBeInTheDocument();
  });

  it('closes full image overlay when escape key is pressed', () => {
    render(<Drawings drawingsList={mockDrawings} drawingsHalloweenList={[]} isTestEnvInstantLoad={true} />);
    fireEvent.click(screen.getByAltText(/Test Drawing/i));
    expect(screen.getByAltText(/Full drawing/i)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByAltText(/Full drawing/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Close full screen image/i)).not.toBeInTheDocument();
  });

  it('closes full image overlay when escape key is pressed while loading', () => {
    render(<Drawings drawingsList={mockDrawings} drawingsHalloweenList={[]} />);
    fireEvent.click(screen.getByAltText(/Test Drawing/i));
    expect(screen.getByAltText(/Full drawing loading/i)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByAltText(/Full drawing/i)).not.toBeInTheDocument();
  });

  it('renders full image overlay when hobbieImage is clicked', () => {
    render(<Drawings drawingsList={mockDrawings} drawingsHalloweenList={[]} isTestEnvInstantLoad={true} />);
    // Find the thumbnail image and click it
    const thumbImg = screen.getByAltText(/Test Drawing/i);
    fireEvent.click(thumbImg);
    // The overlay should now be visible with the full image
    const fullImg = screen.getByAltText(/Full drawing/i);
    expect(fullImg).toBeInTheDocument();
    expect(fullImg).toHaveAttribute('src', '/test-full.jpg');
  });

  it('full image overlay starts with loading', () => {
    render(<Drawings drawingsList={mockDrawings} drawingsHalloweenList={[]} />);
    // Find the thumbnail image and click it
    const thumbImg = screen.getByAltText(/Test Drawing/i);
    fireEvent.click(thumbImg);
    // The overlay should now be visible with the full image
    const fullImg = screen.getByAltText(/Full drawing loading/i);
    expect(fullImg).toBeInTheDocument();
  });

  it('shows a loading spinner while the full image is loading', () => {
    render(<Drawings drawingsList={mockDrawings} drawingsHalloweenList={[]} />);
    fireEvent.click(screen.getByAltText(/Test Drawing/i));
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveTextContent('Loading...');
    expect(spinner.parentElement).toHaveClass('loading');
  });

  it('hides the loading spinner once the full image is loaded', () => {
    render(<Drawings drawingsList={mockDrawings} drawingsHalloweenList={[]} isTestEnvInstantLoad={true} />);
    fireEvent.click(screen.getByAltText(/Test Drawing/i));
    expect(screen.getByRole('status', { hidden: true }).parentElement).toHaveClass('loaded');
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
