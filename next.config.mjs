const isProduction = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isProduction ? "/nnak-licitacao-calculadora" : "",
  assetPrefix: isProduction ? "/nnak-licitacao-calculadora/" : "",
};

export default nextConfig;
