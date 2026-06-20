import { existsSync, renameSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';

export default function rename_styles(): Plugin {
    let outDir = "./dist";

    return {
        name: 'rename_styles',
        configResolved(resolvedConfig) {
            outDir = resolvedConfig.build.outDir;
        },
        closeBundle: () => {
            try {
                const absoluteDistPath = resolve(process.cwd(), outDir);

                const sourcePath = `${absoluteDistPath}/index.css`
                const targetPath = `${absoluteDistPath}/styles.css`;

                if (existsSync(sourcePath)) {
                    renameSync(sourcePath, targetPath);
                }
            } catch (error) {
                console.error(error)
            }
        },
    };
}
