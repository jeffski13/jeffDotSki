/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QrLinkPage from './index';
import { updateLyricsUrl, LyricsQrUpdateForbiddenError } from '../shared/lyricsQrApi';
import { lyricsQrUpdateKeyStoreImpl } from '../shared/lyricsQrUpdateKeyStore';

vi.mock('../shared/lyricsQrApi', async () => {
  const actual = await vi.importActual<typeof import('../shared/lyricsQrApi')>('../shared/lyricsQrApi');
  return {
    ...actual,
    updateLyricsUrl: vi.fn(),
  };
});

const mockedUpdateLyricsUrl = vi.mocked(updateLyricsUrl);

beforeEach(() => {
  mockedUpdateLyricsUrl.mockReset();
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
});
