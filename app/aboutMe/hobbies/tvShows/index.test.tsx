import { render, screen } from '@testing-library/react';
import { TvShows } from './index';
import type { TvShowInfo } from './tvshows';

describe('TvShows Component', () => {
  it('renders correct number of tv shows and finished tv shows', () => {
    const tvShowsList: TvShowInfo[] = [
      { title: 'Show 1', season: 1, thumb: '/thumb1.jpg' },
      { title: 'Show 2', season: 2, thumb: '/thumb2.jpg' },
    ];
    const tvShowsFinishedList: TvShowInfo[] = [
      { title: 'Finished 1', season: 3, thumb: '/finished1.jpg' },
      { title: 'Finished 2', thumb: '/finished2.jpg' },
      { title: 'Finished 3', season: 4, thumb: '/finished3.jpg' },
    ];
    render(<TvShows tvShowsList={tvShowsList} tvShowsFinishedList={tvShowsFinishedList} />);
    // All images should be rendered
    const allImages = screen.getAllByRole('img');
    // Filter by alt text containing 'Show' for tvShowsList
    const tvShowImages = allImages.filter(img =>
      (img as HTMLImageElement).alt.includes('Show 1') || (img as HTMLImageElement).alt.includes('Show 2')
    );
    // Filter by alt text containing 'Finished' for tvShowsFinishedList
    const finishedShowImages = allImages.filter(img =>
      (img as HTMLImageElement).alt.includes('Finished')
    );
    expect(tvShowImages.length).toBe(tvShowsList.length);
    expect(finishedShowImages.length).toBe(tvShowsFinishedList.length);
  });
});
