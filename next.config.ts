import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Neocities serves static files, so generate a self-contained site folder
  // that can be uploaded without a server runtime.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // The untouched Cloudflare database example lives outside the public site.
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
