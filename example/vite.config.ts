import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 8080,
        host: true,
    },
    build: {
        target: "es2024",
        sourcemap: false,
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
});
