import { useEffect, useState } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { fetchLyricsRedirectUrl } from '../shared/lyricsQrApi';

export default function QrRedirectPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchLyricsRedirectUrl()
      .then((url) => {
        if (!cancelled) {
          window.location.href = url;
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load the lyrics link. Please try again.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Container className="text-center mt-5">
      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Spinner animation="border" role="status" className="mb-3" />
          <p>Redirecting to lyrics…</p>
        </>
      )}
    </Container>
  );
}
