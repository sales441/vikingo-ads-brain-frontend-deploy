import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

/** @type {import("vite").UserConfig} */
export default {
  plugins: [react()],
  css: { postcss: { plugins: [tailwindcss(), autoprefixer()] } },
  server: { host: true, port: 5174, strictPort: false, hmr: { overlay: true } },
};
