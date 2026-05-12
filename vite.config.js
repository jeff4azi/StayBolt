import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon-16x16.png",
        "favicon-32x32.png",
        "apple-touch-icon.png",
        "android-chrome-192x192.png",
        "android-chrome-512x512.png",
        "pwa-icon.png",
      ],
      manifest: {
        name: "StayBolt",
        short_name: "StayBolt",
        description:
          "Find and rent your perfect apartment. Browse verified listings and explore neighborhoods.",
        theme_color: "#1a1a2e",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/pwa-icon.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-icon.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico,json}"],
      },
    }),
  ],
});
