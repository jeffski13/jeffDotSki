import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    tailwindcss(),
    !process.env.VITEST && reactRouter(),
    !process.env.VITEST && VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icon.svg", "images/**"],
      manifest: {
        name: "Jeff Szcinski",
        short_name: "jeff.ski",
        description: "Jeff Szcinski - Software Engineer, English Teacher, World Traveler",
        theme_color: "#212529",
        background_color: "#212529",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "favicon.ico",
            sizes: "48x48",
            type: "image/x-icon",
          },
        ],
      },
      workbox: {
        // only precache app shell — images are large and cached at runtime instead
        globPatterns: ["**/*.{js,css,html,ico,svg,woff,woff2}"],
        // raise limit to cover large JS chunks (e.g. EntireBible bundle)
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: "/index.html",
        // don't intercept Firebase Hosting reserved paths
        navigateFallbackDenylist: [/^\/__/],
        runtimeCaching: [
          {
            // cache images on demand with a long TTL
            urlPattern: /\/images\/.+\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
    tsconfigPaths(),
  ],
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
