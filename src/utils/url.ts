import type RouteUrlToken from "../types/RouteUrlToken";

export function tokenizeUrl(path: string): RouteUrlToken[] | undefined {
    return path.split("/").map((token) => {
        const isPathParam = token.startsWith(":");
        const pathParamName = isPathParam ? token.replace(":", "") : undefined;

        return {
            token,
            isPathParam,
            pathParamName,
        };
    });
}
