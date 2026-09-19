import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ant Design ships large barrel files; let Next tree-shake the imports.
  experimental: {
    optimizePackageImports: ["antd", "lucide-react"],
  },
};

export default nextConfig;
