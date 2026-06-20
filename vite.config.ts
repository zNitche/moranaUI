import { defineConfig, esmExternalRequirePlugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from "path";
import { dts_generator, rename_styles } from './vite_plugins';


// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        dts_generator(),
        rename_styles(),
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
            // ignored in current entrypoint setup, rename_styles works as workaround
            // cssFileName: "styles",
        },
        cssCodeSplit: true,
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
