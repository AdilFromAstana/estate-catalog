import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
  define: {
    __API_URL__: JSON.stringify(process.env.VITE_API_URL),
  },
});
