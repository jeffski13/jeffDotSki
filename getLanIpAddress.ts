import type { NetworkInterfaceInfo } from "node:os";

// Picks the machine's current LAN-reachable IPv4 address (e.g. "10.250.19.21")
// out of os.networkInterfaces(), skipping loopback/internal interfaces.
// Used by the dev-only /api/devLanIp middleware in vite.config.ts so a QR
// code can be scanned from a phone on the same network as this machine.
export function getLanIpAddress(
  interfaces: NodeJS.Dict<NetworkInterfaceInfo[]>,
): string | null {
  for (const addresses of Object.values(interfaces)) {
    const match = addresses?.find((info) => info.family === "IPv4" && !info.internal);
    if (match) return match.address;
  }
  return null;
}
