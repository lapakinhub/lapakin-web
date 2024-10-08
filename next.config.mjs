/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['avatars.githubusercontent.com', 'firebasestorage.googleapis.com'], // Add the external domain here
    },
}

export default nextConfig;
