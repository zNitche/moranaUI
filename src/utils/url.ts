import type RouteUrlToken from "../types/RouteUrlToken";

export function splitPath(path: string): string[] {
    return path.split("/").filter((p) => !!p);
}

export function tokenizeUrl(path: string): RouteUrlToken[] | undefined {
    return splitPath(path).map((token) => {
        const isPathParam = token.startsWith(":");
        const pathParamName = isPathParam ? token.replace(":", "") : undefined;

        return {
            token,
            isPathParam,
            pathParamName,
        };
    });
}

export function matchTokenizedUrl(
    routePath: RouteUrlToken[],
    currentPath: string,
): boolean {
    const splitCurrentPath = splitPath(currentPath);

    if (routePath.length !== splitCurrentPath.length) {
        return false;
    }

    let check = true;

    for (let ind = 0; ind < routePath.length; ind++) {
        const baseToken = routePath.at(ind);
        const targetUrlSlice = splitCurrentPath.at(ind);

        if (!baseToken || !splitCurrentPath) {
            check = false;
            break;
        }

        if (baseToken.isPathParam) {
            continue;
        } else {
            if (baseToken.token !== targetUrlSlice) {
                check = false;
                break;
            }
        }
    }

    return check;
}
