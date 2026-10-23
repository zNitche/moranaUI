import type { RouterCache } from "#root/types/RouterCache";
import type RouterNavigationStackItem from "#root/types/RouterNavigationStackItem";

export interface RouterState {
    routerCache: RouterCache;
    navigationStack: RouterNavigationStackItem[];
}

export type RouterEventListener = (state: RouterState) => void;
