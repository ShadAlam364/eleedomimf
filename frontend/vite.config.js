import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // listens on all addresses
    allowedHosts: [
      "eleedomimf.com", // the host that was blocked
      "www.eleedomimf.com",
      "localhost", // keep localhost
      // add any other domains you need
    ]
  }
});
