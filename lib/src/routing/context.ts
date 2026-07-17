import type { NavigationTransitionDirection } from "@root/types/NavigationTransitionDirection";
import type RouteContextType from "@root/types/RouteContextType";
import type RouteData from "@root/types/RouteData";
import type RouterContextType from "@root/types/RouterContextType";
import { createContext, type RefObject } from "react";

export const RouterContext = createContext<RouterContextType>({
    __addRoute: (_route: RouteData) => undefined,
    routerCache: {},
    __addToRouterCache: (
        _uuid: string,
        _ref: RefObject<HTMLDivElement | null> | null,
    ) => undefined,
    clearRouterCache: () => undefined,
    router: {
        currentRoute: undefined,
        path: "",
        navigationStack: [],
    },
    navigateTo: (_params: {
        path: string;
        replace?: boolean;
        popFromCache?: boolean;
        direction?: NavigationTransitionDirection;
    }) => undefined,
    navigateBack: () => undefined,
    getRouteUUIDByName: () => undefined,
    replaceSearchParams: (_params: {
        add?: Record<string, string>;
        remove?: string[];
    }) => undefined,
});

export const RouteContext = createContext<RouteContextType>({
    routeUUID: "",
    registerLifecycleHook: (_type: "enter" | "exit", _callback: () => void) =>
        undefined,
    isCurrentRoute: false,
});
