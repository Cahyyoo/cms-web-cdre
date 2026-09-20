/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    // Uploads live under /public/uploads and need no entry here. The wildcard
    // that used to sit in this list let anyone use /_next/image as an open
    // image proxy for arbitrary hosts — add specific CDN/storage hostnames
    // here instead if content ever moves off local disk.
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
    // Required for the local /avatar-placeholder.svg fallback; the CSP and
    // attachment disposition below are Next.js's prescribed mitigation.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
