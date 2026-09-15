import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next writes its own AGENTS.md/CLAUDE.md here by default. This project sits
  // inside an Obsidian vault whose root CLAUDE.md is hand-maintained; a second
  // generated one is confusing, so it stays off.
  agentRules: false,
  images: {
    // Phase 01 ships designed SVG placeholders. When real photography arrives,
    // drop it in /public/media (or point `remotePatterns` at the CMS host) and
    // the <EditorialImage> contract stays identical.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
};

export default nextConfig;
