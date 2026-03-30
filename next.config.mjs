/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  /** Dev-only: allow Playwright / same-machine clients hitting 127.0.0.1 (Next 16 default blocks cross-origin dev assets). */
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
