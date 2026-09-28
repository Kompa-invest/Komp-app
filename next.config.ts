import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Le Magazine est une page statique (public/magazine/index.html), servie à l'adresse /magazine.
  async rewrites() {
    return [{ source: "/magazine", destination: "/magazine/index.html" }];
  },
};

export default nextConfig;
