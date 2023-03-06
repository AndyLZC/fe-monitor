import { fileURLToPath, URL } from "node:url";
// import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import esbuild from "rollup-plugin-esbuild";
import vue from "@vitejs/plugin-vue";
import unocss from '@unocss/vite';
import externalGlobals from "rollup-plugin-external-globals";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), unocss()],
  build: {
    sourcemap: true,
    rollupOptions: {
      // external: ["Vue", "naive-ui", "vue-router"],
      plugins: [
        // externalGlobals({
        //   vue: "Vue",
        //   "naive-ui": "naive-ui",
        //   "vue-router": "vue-router",
        // }),
        // visualizer({ open: true }),
        esbuild({
          include: /\.[jt]sx?$/, // default, inferred from `loaders` option
          exclude: /node_modules/, // default
          sourceMap: true, // default
          minify: process.env.NODE_ENV === "production",
          target: "esnext", // default, or 'es20XX', 'esnext'
          jsx: "transform", // default, or 'preserve'
          define: {
            __VERSION__: '"x.y.z"',
          },
          tsconfig: "tsconfig.json", // default
          loaders: {
            ".json": "json",
            ".js": "jsx",
          },
        }),
      ],
    },
  },
  base: "./",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
