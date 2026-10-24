/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      // Widget jekono website e iframe hishebe boshte parbe
      {
        source: '/embed/:path*',
        headers: [{ key: 'Content-Security-Policy', value: 'frame-ancestors *' }],
      },
      // Baki sob page iframe e dhukte parbe na (clickjacking theke suroksha)
      {
        source: '/dashboard/:path*',
        headers: [{ key: 'X-Frame-Options', value: 'DENY' }],
      },
      {
        source: '/widget.js',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=300' }],
      },
    ];
  },
};

export default nextConfig;