/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized:true,
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            pathname: '/a/**',
        },
        {
          protocol:"https",
          hostname:"static1.srcdn.com",
        }
    ],
}};

export default nextConfig;
