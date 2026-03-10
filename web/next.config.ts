import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	async rewrites() {
		return [
			{
				source: "/api/algorithms/:path*",
				destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/algorithms/:path*`,
			},
		];
	},
};

export default nextConfig;
