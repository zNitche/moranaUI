import { defineConfig, esmExternalRequirePlugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from "path";
import { execSync } from 'child_process';


// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        {
            name: 'generate-types',
            closeBundle: () => {
                execSync('tsc --project tsconfig.types.json', { stdio: 'inherit' });
            },
        },
    ],
    build: {
        outDir: "dist",
        emptyOutDir: true,
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
