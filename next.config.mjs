/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: () => [
    {
      source: "/school/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "no-store",
        },
      ],
    },
  ],
};

export default nextConfig;
