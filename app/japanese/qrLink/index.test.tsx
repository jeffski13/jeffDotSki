/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QrLinkPage, { getRedirectPageUrl } from './index';
import { ENV } from '../../infra/env';
import { updateLyricsUrl, fetchLyricsQrInfo, LyricsQrUpdateForbiddenError } from '../shared/lyricsQrApi';
import { lyricsQrUpdateKeyStoreImpl } from '../shared/lyricsQrUpdateKeyStore';
import { fetchDevLanIp } from '../shared/devLanIp';

vi.mock('../shared/lyricsQrApi', async () => {
  const actual = await vi.importActual<typeof import('../shared/lyricsQrApi')>('../shared/lyricsQrApi');
  return {
    ...actual,
    updateLyricsUrl: vi.fn(),
    fetchLyricsQrInfo: vi.fn(),
  };
});

vi.mock('../shared/devLanIp', () => ({
  fetchDevLanIp: vi.fn(),
}));

const mockedUpdateLyricsUrl = vi.mocked(updateLyricsUrl);
const mockedFetchDevLanIp = vi.mocked(fetchDevLanIp);
const mockedFetchLyricsQrInfo = vi.mocked(fetchLyricsQrInfo);

beforeEach(() => {
  mockedUpdateLyricsUrl.mockReset();
  mockedFetchDevLanIp.mockReset();
  mockedFetchLyricsQrInfo.mockReset();
  mockedFetchLyricsQrInfo.mockResolvedValue({ url: null, version: '0.0.0' });
  localStorage.clear();
});

describe('QrLinkPage', () => {
  it('disables the Update button until the URL textarea has content', () => {
    render(<QrLinkPage />);

    expect(screen.getByRole('button', { name: 'Update' })).toBeDisabled();

    fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'https://example.com/lyrics' } });

    expect(screen.getByRole('button', { name: 'Update' })).toBeEnabled();
  });

  it('does not require the Update Key to be filled in', async () => {
    mockedUpdateLyricsUrl.mockResolvedValue(undefined);
    render(<QrLinkPage />);

    fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'https://example.com/lyrics' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    await waitFor(() => {
      expect(mockedUpdateLyricsUrl).toHaveBeenCalledWith('', 'https://example.com/lyrics');
    });
  });

  it('saves a filled-in Update Key to local storage and sends it with the update', async () => {
    mockedUpdateLyricsUrl.mockResolvedValue(undefined);
    render(<QrLinkPage />);

    fireEvent.change(screen.getByLabelText('Update Key'), { target: { value: 'my-secret-key' } });
    fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'https://example.com/lyrics' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    await waitFor(() => {
      expect(mockedUpdateLyricsUrl).toHaveBeenCalledWith('my-secret-key', 'https://example.com/lyrics');
    });
    expect(lyricsQrUpdateKeyStoreImpl.getUpdateKey()).toBe('my-secret-key');
  });

  it('reuses the previously saved Update Key and leaves it untouched when the field is left blank', async () => {
    lyricsQrUpdateKeyStoreImpl.setUpdateKey('previously-saved-key');
    mockedUpdateLyricsUrl.mockResolvedValue(undefined);
    render(<QrLinkPage />);

    fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'https://example.com/lyrics' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    await waitFor(() => {
      expect(mockedUpdateLyricsUrl).toHaveBeenCalledWith('previously-saved-key', 'https://example.com/lyrics');
    });
    expect(lyricsQrUpdateKeyStoreImpl.getUpdateKey()).toBe('previously-saved-key');
  });

  it('shows a message when the update key is rejected', async () => {
    mockedUpdateLyricsUrl.mockRejectedValue(new LyricsQrUpdateForbiddenError('nope'));
    render(<QrLinkPage />);

    fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'https://example.com/lyrics' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    expect(await screen.findByText('Update key is not valid.')).toBeInTheDocument();
  });

  it('shows a generic error message when the update fails for another reason', async () => {
    mockedUpdateLyricsUrl.mockRejectedValue(new Error('network down'));
    render(<QrLinkPage />);

    fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'https://example.com/lyrics' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    expect(await screen.findByText('Could not update the lyrics link. Please try again.')).toBeInTheDocument();
  });

  it('shows a success message once the update completes', async () => {
    mockedUpdateLyricsUrl.mockResolvedValue(undefined);
    render(<QrLinkPage />);

    fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'https://example.com/lyrics' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    expect(await screen.findByText('Lyrics link updated.')).toBeInTheDocument();
  });

  describe('URL and Version info', () => {
    it('fetches and shows the current URL and version when the page loads', async () => {
      mockedFetchLyricsQrInfo.mockResolvedValue({ url: 'https://example.com/lyrics', version: '1.2.3' });

      render(<QrLinkPage />);

      await waitFor(() => {
        expect(screen.getByTestId('qrLink-info-url')).toHaveTextContent('https://example.com/lyrics');
      });
      expect(screen.getByTestId('qrLink-info-version')).toHaveTextContent('1.2.3');
      expect(mockedFetchLyricsQrInfo).toHaveBeenCalledTimes(1);
    });

    it('renders the current URL as a link that opens in a new tab', async () => {
      mockedFetchLyricsQrInfo.mockResolvedValue({ url: 'https://example.com/lyrics', version: '1.2.3' });

      render(<QrLinkPage />);

      const link = await screen.findByRole('link', { name: 'https://example.com/lyrics' });
      expect(link).toHaveAttribute('href', 'https://example.com/lyrics');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('shows "Not set" when no URL has been set yet', async () => {
      mockedFetchLyricsQrInfo.mockResolvedValue({ url: null, version: '1.2.3' });

      render(<QrLinkPage />);

      await waitFor(() => {
        expect(screen.getByTestId('qrLink-info-url')).toHaveTextContent('Not set');
      });
      expect(screen.getByTestId('qrLink-info-version')).toHaveTextContent('1.2.3');
    });

    it('refreshes the URL and version after a successful update', async () => {
      mockedFetchLyricsQrInfo.mockResolvedValueOnce({ url: 'https://example.com/old', version: '1.0.0' });
      mockedFetchLyricsQrInfo.mockResolvedValueOnce({ url: 'https://example.com/new', version: '1.0.1' });
      mockedUpdateLyricsUrl.mockResolvedValue(undefined);

      render(<QrLinkPage />);

      await waitFor(() => {
        expect(screen.getByTestId('qrLink-info-url')).toHaveTextContent('https://example.com/old');
      });

      fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'https://example.com/new' } });
      fireEvent.click(screen.getByRole('button', { name: 'Update' }));

      await waitFor(() => {
        expect(screen.getByTestId('qrLink-info-url')).toHaveTextContent('https://example.com/new');
      });
      expect(screen.getByTestId('qrLink-info-version')).toHaveTextContent('1.0.1');
      expect(mockedFetchLyricsQrInfo).toHaveBeenCalledTimes(2);
    });

    it('does not refresh the URL and version when the update fails', async () => {
      mockedFetchLyricsQrInfo.mockResolvedValue({ url: 'https://example.com/old', version: '1.0.0' });
      mockedUpdateLyricsUrl.mockRejectedValue(new Error('network down'));

      render(<QrLinkPage />);

      fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'https://example.com/new' } });
      fireEvent.click(screen.getByRole('button', { name: 'Update' }));

      expect(await screen.findByText('Could not update the lyrics link. Please try again.')).toBeInTheDocument();
      expect(mockedFetchLyricsQrInfo).toHaveBeenCalledTimes(1);
    });

    it('shows a loading state before the info arrives', () => {
      mockedFetchLyricsQrInfo.mockReturnValue(new Promise(() => {}));

      render(<QrLinkPage />);

      expect(screen.getByTestId('qrLink-info-url')).toHaveTextContent('Loading…');
      expect(screen.getByTestId('qrLink-info-version')).toHaveTextContent('Loading…');
    });

    it('shows "Unavailable" when the info request fails', async () => {
      mockedFetchLyricsQrInfo.mockRejectedValue(new Error('network down'));

      render(<QrLinkPage />);

      await waitFor(() => {
        expect(screen.getByTestId('qrLink-info-url')).toHaveTextContent('Unavailable');
      });
      expect(screen.getByTestId('qrLink-info-version')).toHaveTextContent('Unavailable');
    });
  });


  describe('getRedirectPageUrl', () => {
    it('builds the redirect URL from the current location by default', () => {
      expect(getRedirectPageUrl()).toBe(`${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/japanese/qrRedirect`);
    });

    it('swaps in the given LAN IP while keeping the protocol and port', () => {
      expect(getRedirectPageUrl('10.250.19.21')).toBe(`${window.location.protocol}//10.250.19.21${window.location.port ? `:${window.location.port}` : ''}/japanese/qrRedirect`);
    });
  });

  describe('dev LAN IP lookup', () => {
    const originalNodeEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });

    it('looks up the LAN IP in dev so the QR code works from a phone on the same network', async () => {
      process.env.NODE_ENV = ENV.DEV;
      mockedFetchDevLanIp.mockResolvedValue('10.250.19.21');

      render(<QrLinkPage />);

      await waitFor(() => {
        expect(mockedFetchDevLanIp).toHaveBeenCalled();
      });
    });

    it('does not look up the LAN IP outside of dev', async () => {
      process.env.NODE_ENV = ENV.PROD;

      render(<QrLinkPage />);

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(mockedFetchDevLanIp).not.toHaveBeenCalled();
    });

    it('keeps the current URL if the LAN IP lookup fails', async () => {
      process.env.NODE_ENV = ENV.DEV;
      mockedFetchDevLanIp.mockRejectedValue(new Error('lookup failed'));

      render(<QrLinkPage />);

      await waitFor(() => {
        expect(mockedFetchDevLanIp).toHaveBeenCalled();
      });
      // no error surfaced to the user — the localhost-based QR code still renders
      expect(document.querySelector('.qrLink-qr-code')).toBeInTheDocument();
    });
  });
});
