/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";
import type RouterContextType from "../types/RouterContextType";
import type RouteData from "../types/RouteData";

export const RouterContext = createContext<RouterContextType>({
    __addRoute(_route: RouteData): void {
        throw new Error("Function not implemented");
    },
    router: { currentRoute: undefined, path: "" },
    navigateTo(_url: string, _replace: boolean ): void {
        throw new Error("Function not implemented");
    },
    navigateBack(): void {
        throw new Error("Function not implemented");
    },
});
