import type RouteData from "@root/types/RouteData";
import type RouterContextType from "@root/types/RouterContextType";
import { createContext } from "react";

export const RouterContext = createContext<RouterContextType>({
    __addRoute: (_route: RouteData) => undefined,
    router: { currentRoute: undefined, path: "", navigationState: undefined },
    navigateTo: (_url: string, _replace: boolean) => undefined,
    navigateBack: () => undefined,
});
