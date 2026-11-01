import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite (local database) ships its own WASM + files; keep it out of the bundle.
  serverExternalPackages: ["@electric-sql/pglite", "exceljs"],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80, 85, 90, 95],
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
