// Dev-only: resolves the machine's current LAN IP from a Vite dev-server
// middleware (see vite.config.ts) so a QR code scanned by a phone on the
// same network can reach this machine instead of "localhost". Not available
// (and not needed) in production, where window.location already reflects
// the real public domain.
export const DEV_LAN_IP_URL = '/api/devLanIp';

interface DevLanIpResponse {
  ip: string | null;
}

export async function fetchDevLanIp(): Promise<string | null> {
  const response = await fetch(DEV_LAN_IP_URL);

  if (!response.ok) {
    return null;
  }

  const data: DevLanIpResponse = await response.json();
  return data.ip;
}
