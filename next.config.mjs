/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["unpdf", "mammoth", "word-extractor", "xlsx", "jszip"],
};
export default nextConfig;
