/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/:id*",
        destination: "/",
      },
    ];
  },
};

export default nextConfig;
