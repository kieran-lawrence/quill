/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['http://localhost:3000'],
    compiler: {
        // For other options, see https://styled-components.com/docs/tooling#babel-plugin
        styledComponents: true,
    },
}

export default nextConfig
