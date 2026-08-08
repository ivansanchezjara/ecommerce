/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
    ],
    // En desarrollo las imágenes vienen de localhost (IP privada),
    // lo cual bloquea el optimizador de Next.js. Se desactiva aquí
    // y se habilita en producción con el hostname real.
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
