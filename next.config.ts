import type { NextConfig } from "next";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // This will ignore ESLint errors during build
    },
};

export default nextConfig;