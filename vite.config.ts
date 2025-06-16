import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { resolve } from "path";
import { libInjectCss } from "vite-plugin-lib-inject-css";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), libInjectCss()],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "lib/main.tsx"),
      name: "BPM",
      fileName: "bpm",
      // formats: ['umd']
    },
    copyPublicDir: false,
    rollupOptions: {
      output: {},
    },
  },
});
