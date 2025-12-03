import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "node:path";

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.json",
      entryRoot: "src",
      outputDir: "dist",
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      formats: ["es"],
      fileName: () => "index.mjs",
    },
    rollupOptions: {
      external: ["react", "react-dom"],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
