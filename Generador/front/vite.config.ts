import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
  export default defineConfig({
   
    server: {
      host: "0.0.0.0",
      port: 3000,
      proxy: {
        "/accessin-api": {
          target: "http://api.accessin.net/api/doppler/new_vehicle_penalty",
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (path) => path.replace(/^\/accessin-api/, ""),
        },
      },
    },
  envPrefix: "REACT_APP",
  plugins: [react()],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
});
