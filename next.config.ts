import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /**
   * Mission Control is served behind the main site as a subpath.
   * Public base URL: https://morpheuxx.meimberg.io/missioncontrol
   */
  basePath: '/missioncontrol',
};

export default nextConfig;
