import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';
import ROUTES from '../../consts/ROUTES';
import { updateLyricsUrl, LyricsQrUpdateForbiddenError } from '../shared/lyricsQrApi';
import { lyricsQrUpdateKeyStoreImpl } from '../shared/lyricsQrUpdateKeyStore';
import './styles.css';

export const QR_CODE_SIZE = 320;

export function getRedirectPageUrl(): string {
  return `${window.location.origin}${ROUTES.japanese.qrRedirect}`;
}

export default function QrLinkPage() {
  const [redirectUrl] = useState(() => (typeof window !== 'undefined' ? getRedirectPageUrl() : ''));
  const [updateKeyInput, setUpdateKeyInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
          <Form.Group className="qrLink-form-group" controlId="qrLinkUpdateKey">
            <Form.Label>Update Key</Form.Label>
            <Form.Control
              type="text"
              value={updateKeyInput}
              onChange={(e) => setUpdateKeyInput(e.target.value)}
              placeholder="Leave blank to reuse the saved key"
            />
          </Form.Group>

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
      </Container>
    </div>
  );
}
