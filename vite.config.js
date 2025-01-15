import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	define: {
		"process.env": {},
	},
	build: {
		outDir: "dist", // Ensure the build output is directed to the 'dist' folder
	},
	server: {
		port: 5173,
		proxy: {
			"/api": {
				target: "http://localhost:3001",
				changeOrigin: true,
			},
		},
	},
});
