/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";
import type RouterContextType from "../types/RouterContextType";
import type RouterData from "../types/RouteData";

export const RouterContext = createContext<RouterContextType>({
    addRoute(_route: RouterData): void {
        throw new Error("Function not implemented");
    },
    currentRoute: "",
    navigateTo(_url: string): void {
        throw new Error("Function not implemented");
    },
    navigateBack(): void {
        throw new Error("Function not implemented");
    },
});
