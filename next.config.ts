import type { NextConfig } from "next";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig: NextConfig = {
    staticPageGenerationTimeout: 600 // Increase timeout to 3 minutes
};

export default nextConfig;