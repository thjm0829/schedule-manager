/** @type {import('next').NextConfig} */
// GitHub Pages 프로젝트 페이지는 https://<user>.github.io/<repo>/ 형태라
// basePath가 필요하다. 로컬 빌드/미리보기에서는 비워두고, GitHub Actions
// 워크플로우가 저장소 이름으로 BASE_PATH를 채워서 빌드한다.
const basePath = process.env.BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  images: { unoptimized: true },
};

module.exports = nextConfig;
