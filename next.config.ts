import type { NextConfig } from "next";
//import MillionLint from "@million/lint";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;

//export default MillionLint.next({ rsc: true })(nextConfig);