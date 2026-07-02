import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // We have sibling lockfiles under the home dir; pin the workspace root.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
