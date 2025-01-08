import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_BACKEND_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      "/socket": {
        target: process.env.VITE_BACKEND_BASE_URL,
        changeOrigin: true,
        ws: true, 
        rewrite: (path) => path.replace(/^\/socket/, '')
      },
    },
  },
});