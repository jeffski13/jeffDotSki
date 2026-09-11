/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor } from '@testing-library/react';
import QrRedirectPage from './index';
import { fetchLyricsRedirectUrl } from '../shared/lyricsQrApi';

vi.mock('../shared/lyricsQrApi', () => ({
  fetchLyricsRedirectUrl: vi.fn(),
}));

const mockedFetchLyricsRedirectUrl = vi.mocked(fetchLyricsRedirectUrl);

describe('QrRedirectPage', () => {
  let originalLocation: Location;

  beforeEach(() => {
    mockedFetchLyricsRedirectUrl.mockReset();
    originalLocation = window.location;
    // @ts-expect-error - jsdom's window.location isn't directly assignable
    delete window.location;
    // @ts-expect-error - stub with just the property this component touches
    window.location = { href: '' };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('redirects the browser to the url returned by the API', async () => {
    mockedFetchLyricsRedirectUrl.mockResolvedValue('https://example.com/lyrics');

    render(<QrRedirectPage />);

    await waitFor(() => {
      expect(window.location.href).toBe('https://example.com/lyrics');
    });
  });

  it('shows an error message when the API call fails', async () => {
    mockedFetchLyricsRedirectUrl.mockRejectedValue(new Error('network down'));

    render(<QrRedirectPage />);

    expect(await screen.findByText('Could not load the lyrics link. Please try again.')).toBeInTheDocument();
  });
});
