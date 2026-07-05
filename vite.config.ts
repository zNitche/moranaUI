/// <reference types="vitest/config" />

import { defineConfig, esmExternalRequirePlugin } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { dts_generator } from "./vite_plugins";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), dts_generator()],
    build: {
        outDir: "dist",
        emptyOutDir: true,
        target: "es2024",
        lib: {
            entry: resolve(import.meta.dirname, "src/index.ts"),
            name: "moranaui",
            fileName: (format, entryName) => {
                return `moranaui.${entryName}.${format}.js`;
            },
            formats: ["es"],
            cssFileName: "styles.css",
        },
        cssCodeSplit: true,
        rollupOptions: {
            plugins: [
                esmExternalRequirePlugin({
                    external: ["react", "react-dom"],
                }),
            ],
            output: {
                chunkFileNames: "moranaui.[format].js",
                assetFileNames: (asset) => {
                    if (
                        asset.names.length === 1 &&
                        asset.names[0].endsWith(".css")
                    ) {
                        return "styles.css";
                    }

                    return "[name].[ext]";
                },
            },
        },
    },
    test: {
        environment: "node",
        coverage: {
            provider: "v8"
        },
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
});
