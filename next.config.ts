import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // devIndicators: false,
  devIndicators: {
    position: "bottom-right", // top-right, bottom-right, top-left, bottom-left
  },
};

export default nextConfig;
