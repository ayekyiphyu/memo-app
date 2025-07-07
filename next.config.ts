// import type { NextConfig } from "next";
// import path from "path";

// const nextConfig: NextConfig = {
//   output: "export",
//   trailingSlash: true,
//   appDir: true,
//   devIndicators: false,
//   turbopack: {},
//   webpack: (config) => {
//     config.resolve.alias["@components"] = path.join(__dirname, "components");
//     config.resolve.alias["@styles"] = path.join(__dirname, "styles");
//     return config;
//   },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: "/memo-app", // Replace 'memo-app' with your repository name
  assetPrefix: "/memo-app/", // Replace 'memo-app' with your repository name
};

module.exports = nextConfig;
