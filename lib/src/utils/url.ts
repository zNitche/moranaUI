import type RouteUrlToken from "../types/RouteUrlToken";
import type UrlMatchResponse from "../types/UrlMatchResponse";

export function splitPath(path: string): string[] {
    const urlObj = new URL(path, window.location.origin);

    return urlObj.pathname.split("/").filter((p) => !!p);
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
): UrlMatchResponse {
    const splitCurrentPath = splitPath(currentPath);

    const returnData: UrlMatchResponse = {
        isMatching: false,
        pathParams: undefined,
    };

    if (routePath.length !== splitCurrentPath.length) {
        return returnData;
    }

    const params: Record<string, string> = {};

    for (let ind = 0; ind < routePath.length; ind++) {
        const baseToken = routePath.at(ind);
        const targetUrlSlice = splitCurrentPath.at(ind);

        if (!baseToken || !splitCurrentPath) {
            return returnData;
        }

        if (baseToken.isPathParam) {
            if (baseToken.pathParamName && targetUrlSlice) {
                params[baseToken.pathParamName] = targetUrlSlice;
            }
        } else {
            if (baseToken.token !== targetUrlSlice) {
                return returnData;
            }
        }
    }

    returnData.isMatching = true;
    returnData.pathParams = params;

    return returnData;
}

export function buildUrl(
    path: string,
    params: Record<
        string,
        string | number | boolean | (string | number | undefined)[]
    >,
) {
    const urlObj = new URL(path, window.location.origin);

    for (const [key, val] of Object.entries(params)) {
        if (Array.isArray(val)) {
            val.forEach((item) => {
                if (item === undefined) {
                    return;
                }

                return urlObj.searchParams.append(key, item.toString());
            });
        } else {
            urlObj.searchParams.append(key, val.toString());
        }
    }

    return urlObj.pathname + urlObj.search;
}
