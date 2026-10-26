import type RouteContextType from "#root/types/RouteContextType";
import type RouterContextType from "#root/types/RouterContextType";
import { createContext } from "react";

export const RouterContext = createContext<RouterContextType | null>(null);
export const RouteContext = createContext<RouteContextType | null>(null);
