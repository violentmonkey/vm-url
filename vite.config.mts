import { defineConfig } from "vite";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));
const banner = `/*! ${pkg.name} v${pkg.version} | ${pkg.license} License */`;
const values = {
  __VERSION__: JSON.stringify(pkg.version),
};

export default defineConfig({
  define: { ...values },
  build: {
    outDir: "dist",
    target: "es2015",
    lib: {
      entry: "src/index.ts",
      name: "VM",
      formats: ["es", "umd"],
      fileName: (format) => (format === "es" ? "index.mjs" : "index.js"),
    },
    rollupOptions: {
      output: {
        banner,
        extend: true,
      },
    },
  },
});
