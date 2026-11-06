import type { MetadataRoute } from "next";

/** Lets phones add Rayakan.my.id to the home screen with the right name and colours. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rayakan.my.id · Undangan Digital",
    short_name: "Rayakan",
    description: "Undangan digital pernikahan, ulang tahun, dan khitanan yang bisa dibuat dan diubah sendiri dari HP.",
    lang: "id",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f2ea",
    theme_color: "#15110e",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
