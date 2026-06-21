import { execSync } from "node:child_process";
import type { Plugin } from "vite";

export default function dts_generator(): Plugin {
    return {
        name: "dts_generator",
        closeBundle: () => {
            try {
                execSync("tsc --project tsconfig.types.json", {
                    stdio: "inherit",
                });
            } catch (error) {
                console.error(error);
            }
        },
    };
}
