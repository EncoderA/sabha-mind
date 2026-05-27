import type { NextConfig } from "next";

const meetAddonFrameAncestors =
  "frame-ancestors 'self' https://meet.google.com";
const userAppFrameAncestors = "frame-ancestors 'none'";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/meet-addon/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: meetAddonFrameAncestors,
          },
        ],
      },
      {
        source: "/:path((?!meet-addon(?:/|$)).*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: userAppFrameAncestors,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
