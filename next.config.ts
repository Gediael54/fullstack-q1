/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['sequelize', 'pg', 'pg-hstore', 'bcryptjs', 'jsonwebtoken'],
  
  experimental: {
  },
  
  webpack: (config: any) => {
    config.externals = [...config.externals, 'sequelize'];
    return config;
  },
  
  env: {
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    JWT_SECRET: process.env.JWT_SECRET,
  },
};

export default nextConfig;