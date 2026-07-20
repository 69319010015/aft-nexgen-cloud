import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicit distDir + disable Turbopack for Thai-path compatibility
  distDir: ".next",
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
