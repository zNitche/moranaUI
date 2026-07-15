import fs from "node:fs";
import path from "node:path";
import tsconfig from "../tsconfig.json" with { type: "json" };

type FlatDirStructure = {
    path: string;
}[];

function getFlatDirStructure(dirPath: string, outputStruct: FlatDirStructure) {
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
        throw new Error(`'${dirPath}' doesn't exist or is not a directory.`);
    }

    const dirFiles = fs.readdirSync(dirPath);

    for (const itemName of dirFiles) {
        const itemPath = path.join(dirPath, itemName);

        if (fs.statSync(itemPath).isDirectory()) {
            outputStruct = getFlatDirStructure(itemPath, outputStruct);
        } else {
            if (itemPath.endsWith(".ts")) {
                outputStruct.push({ path: itemPath });
            }
        }
    }

    return outputStruct;
}

function resolveFileImports(
    importAlias: string,
    filePath: string,
    rootDir: string,
): boolean {
    let fileContent = fs.readFileSync(filePath, "utf-8");

    if (!fileContent.includes(importAlias)) {
        return false;
    }

    // console.info(`resolving import aliases for ${filePath}`);

    const relativePathToTargetRoot = path.relative(
        path.dirname(filePath),
        rootDir,
    );
    const importPathPrefix = !relativePathToTargetRoot
        ? "./"
        : relativePathToTargetRoot + "/";

    fileContent = fileContent.replaceAll(importAlias, importPathPrefix);
    fs.writeFileSync(filePath, fileContent, "utf-8");

    return true;
}

function main() {
    const agrs = getArgs();
    const targetDirPath = agrs.at(1);

    console.info(`resolving import aliases for '${targetDirPath}'...`);

    if (!targetDirPath) {
        throw new Error("target dir path not provided");
    }

    let filesStruct: FlatDirStructure = [];
    filesStruct = getFlatDirStructure(targetDirPath, filesStruct);

    console.info(`got ${filesStruct.length} files, processing...`);

    let importAlias = Object.keys(tsconfig.compilerOptions.paths).at(0);

    if (!importAlias) {
        throw new Error("import alias has not been provided in tsconfig.json");
    }

    importAlias = importAlias.replaceAll("*", "");
    let processedFiles = 0;

    for (const file of filesStruct) {
        const done = resolveFileImports(importAlias, file.path, targetDirPath);

        if (done) {
            processedFiles++;
        }
    }

    console.info(
        `Resolving imports operation has been completed. Processed ${processedFiles} files`,
    );
}

function getArgs() {
    return process.argv.slice(2);
}

main();
