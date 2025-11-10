import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), !process.env.VITEST && reactRouter(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      exclude: [
        'build/client/assets/**', // Build
        'firebaseski/public/assets/**', // Build
        '**/+types/**', // react router
        '.react-router/**', // react router
        'react-router.config.ts', // react router
        '**/route.tsx',
        'vite.config.ts',
      ],
    },
  },
});
