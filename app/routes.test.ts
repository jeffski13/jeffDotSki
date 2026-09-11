import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import type { RouteConfigEntry } from "@react-router/dev/routes";
import routes from "./routes";

const appDir = path.resolve(__dirname);

function flatten(entries: RouteConfigEntry[]): RouteConfigEntry[] {
  return entries.flatMap((entry) => [entry, ...flatten(entry.children ?? [])]);
}

describe("routes.ts", () => {
  it.each(flatten(routes).map((entry) => entry.file))(
    "route file %s exists in app/",
    (file) => {
      expect(fs.existsSync(path.join(appDir, file))).toBe(true);
    },
  );
});
