import type { RefObject } from "react";
import type RouteData from "./RouteData";
import type { RouterCache } from "./RouterCache";
import type RouterProps from "./RouterProps";

export default interface RouterContextType {
    router: RouterProps;
    __addRoute: (route: RouteData) => void;
    routerCache: RouterCache;
    __addToRouterCache: (
        uuid: string,
        ref: RefObject<HTMLDivElement | null> | null,
    ) => void;
    clearRouterCache: () => void;
    navigateTo: ({
        path,
        replace,
        popFromCache,
    }: {
        path: string;
        replace?: boolean;
        popFromCache?: boolean;
    }) => void;
    navigateBack: () => void;
}
