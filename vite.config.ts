import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // <-- это позволит заходить через IP
    port: 5173, // можно указать порт явно
  },
  define: {
    __API_URL__: JSON.stringify(process.env.VITE_API_URL),
  },
});
