import type { RefObject } from "react";
import type RouteData from "./RouteData";
import type { RouterCache } from "./RouterCache";
import type RouterProps from "./RouterProps";
import type { NavigationTransitionDirection } from "./NavigationTransitionDirection";

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
        direction,
    }: {
        path: string;
        replace?: boolean;
        popFromCache?: boolean;
        direction?: NavigationTransitionDirection;
    }) => void;
    navigateBack: () => void;
    getRouteUUIDByName: (name: string) => string | undefined;
}
