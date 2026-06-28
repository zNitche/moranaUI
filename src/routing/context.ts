import type RouteData from "@root/types/RouteData";
import type RouterContextType from "@root/types/RouterContextType";
import { createContext } from "react";

export const RouterContext = createContext<RouterContextType>({
    __addRoute: (_route: RouteData) => undefined,
    routerCache: [],
    __addToRouterCache: (_uuid: string) => undefined,
    clearRouterCache: () => undefined,
    router: { currentRoute: undefined, path: "", navigationState: undefined },
    navigateTo: (_params: { path: string; replace?: boolean }) => undefined,
    navigateBack: () => undefined,
});
