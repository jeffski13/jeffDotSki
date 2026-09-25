import { useEffect, useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';
import ROUTES from '../../consts/ROUTES';
import { ENV, getEnv } from '../../infra/env';
import {
  updateLyricsUrl,
  fetchLyricsQrInfo,
  LyricsQrUpdateForbiddenError,
  type LyricsQrInfo,
} from '../shared/lyricsQrApi';
import { lyricsQrUpdateKeyStoreImpl } from '../shared/lyricsQrUpdateKeyStore';
import { fetchDevLanIp } from '../shared/devLanIp';
import './styles.css';

export const QR_CODE_SIZE = 320;

// In dev, swap "localhost" for the machine's current LAN IP (fetched from the
// vite dev server, since it changes with every network) so a phone on the
// same network can actually reach this page when it scans the QR code.
export function getRedirectPageUrl(lanIpOverride?: string): string {
  const { protocol, hostname, port } = window.location;
  const host = lanIpOverride ?? hostname;
  const origin = `${protocol}//${host}${port ? `:${port}` : ''}`;
  return `${origin}${ROUTES.japanese.qrRedirect}`;
}

export default function QrLinkPage() {
  const [redirectUrl, setRedirectUrl] = useState(() => (typeof window !== 'undefined' ? getRedirectPageUrl() : ''));
  const [updateKeyInput, setUpdateKeyInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [info, setInfo] = useState<LyricsQrInfo | null>(null);
  const [infoError, setInfoError] = useState(false);

  const loadInfo = (isCancelled: () => boolean = () => false) =>
    fetchLyricsQrInfo()
      .then((result) => {
        if (isCancelled()) return;
        setInfo(result);
        setInfoError(false);
      })
      .catch(() => {
        if (!isCancelled()) setInfoError(true);
      });

  useEffect(() => {
    let cancelled = false;
    loadInfo(() => cancelled);

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (getEnv() !== ENV.DEV) return;

    fetchDevLanIp()
      .then((lanIp) => {
        if (lanIp) setRedirectUrl(getRedirectPageUrl(lanIp));
      })
      .catch(() => {
        // keep the localhost-based URL as a fallback
      });
  }, []);

  const handleUpdate = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    if (updateKeyInput.trim().length > 0) {
      lyricsQrUpdateKeyStoreImpl.setUpdateKey(updateKeyInput);
    }
    const updateKey = lyricsQrUpdateKeyStoreImpl.getUpdateKey();

    try {
      await updateLyricsUrl(updateKey, urlInput);
      setSuccess(true);
      loadInfo();
    } catch (err) {
      if (err instanceof LyricsQrUpdateForbiddenError) {
        setError('Update key is not valid.');
      } else {
        setError('Could not update the lyrics link. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="qrLink-wrapper">
      <Container className="qrLink-content">
        <h1 className="qrLink-title">Lyrics QR Code</h1>
        <p className="qrLink-subtitle">Scan to jump straight to the lyrics for the current song.</p>

        <div className="qrLink-qr-wrapper">
          {redirectUrl && (
            <QRCodeSVG value={redirectUrl} size={QR_CODE_SIZE} className="qrLink-qr-code" />
          )}
        </div>

        <Form
          className="qrLink-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <Form.Group className="qrLink-form-group" controlId="qrLinkUrl">
            <Form.Label>URL</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://..."
            />
          </Form.Group>

          <Form.Group className="qrLink-form-group" controlId="qrLinkUpdateKey">
            <Form.Label>Update Key</Form.Label>
            <Form.Control
              type="text"
              value={updateKeyInput}
              onChange={(e) => setUpdateKeyInput(e.target.value)}
              placeholder="Leave blank to reuse the saved key"
            />
          </Form.Group>

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          {success && <Alert variant="success" className="mt-3">Lyrics link updated.</Alert>}

          <Button
            type="submit"
            variant="primary"
            disabled={urlInput.trim().length === 0 || saving}
            className="qrLink-update-btn"
          >
            {saving ? 'Updating…' : 'Update'}
          </Button>
        </Form>

        <dl className="qrLink-info">
          <div className="qrLink-info-row">
            <dt>URL</dt>
            <dd data-testid="qrLink-info-url">
              {infoError ? (
                'Unavailable'
              ) : !info ? (
                'Loading…'
              ) : !info.url ? (
                'Not set'
              ) : (
                <a href={info.url} target="_blank" rel="noopener noreferrer">
                  {info.url}
                </a>
              ) }
            </dd>
          </div>
          <div className="qrLink-info-row">
            <dt>Version</dt>
            <dd data-testid="qrLink-info-version">
              {infoError ? 'Unavailable' : info ? info.version : 'Loading…'}
            </dd>
          </div>
        </dl>
      </Container>
    </div>
  );
}
