/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '6a4w1lmxep0ufhyo.public.blob.vercel-storage.com',
            port: '',
          },
        ],
      },
};

export default nextConfig;
