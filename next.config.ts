import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Özel tasarım formundaki dosya yüklemeleri için (3 dosya × ~10MB + form)
      bodySizeLimit: "32mb",
    },
  },
};

export default nextConfig;
