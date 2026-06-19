import { defineConfig, esmExternalRequirePlugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from "path";
import dts_generator from './vite_plugins/dts_generator';


// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        dts_generator(),
    ],
    build: {
        outDir: "dist",
        emptyOutDir: true,
        target: "es2024",
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'moranaui',
            fileName: (format) => `moranaui.${format}.js`,
            formats: ["es"],
            cssFileName: "styles",
        },
        cssCodeSplit: false,
        rollupOptions: {
            plugins: [
                esmExternalRequirePlugin({
                    external: ['react', 'react-dom'],
                }),
            ],
        },
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
});
