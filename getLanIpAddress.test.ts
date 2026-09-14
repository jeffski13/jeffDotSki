/// <reference types="vitest/globals" />
import type { NetworkInterfaceInfo } from "node:os";
import { getLanIpAddress } from "./getLanIpAddress";

function ipv4(address: string, internal: boolean): NetworkInterfaceInfo {
  return {
    address,
    internal,
    family: "IPv4",
    netmask: "255.255.255.0",
    mac: "00:00:00:00:00:00",
    cidr: `${address}/24`,
  };
}

function ipv6(address: string, internal: boolean): NetworkInterfaceInfo {
  return {
    address,
    internal,
    family: "IPv6",
    netmask: "ffff:ffff:ffff:ffff::",
    mac: "00:00:00:00:00:00",
    cidr: `${address}/64`,
    scopeid: 0,
  };
}

describe("getLanIpAddress", () => {
  it("returns the first non-internal IPv4 address", () => {
    const interfaces = {
      lo0: [ipv4("127.0.0.1", true)],
      en0: [ipv6("fe80::1", false), ipv4("10.250.19.21", false)],
    };

    expect(getLanIpAddress(interfaces)).toBe("10.250.19.21");
  });

  it("skips internal (loopback) interfaces", () => {
    const interfaces = {
      lo0: [ipv4("127.0.0.1", true)],
    };

    expect(getLanIpAddress(interfaces)).toBeNull();
  });

  it("returns null when there is no IPv4 address", () => {
    const interfaces = {
      en0: [ipv6("fe80::1", false)],
    };

    expect(getLanIpAddress(interfaces)).toBeNull();
  });

  it("returns null for an empty interface list", () => {
    expect(getLanIpAddress({})).toBeNull();
  });
});
