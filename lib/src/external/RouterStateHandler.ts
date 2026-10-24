import type { NavigationTransitionDirection } from "#root/types/NavigationTransitionDirection";
import type RouterNavigationStackItem from "#root/types/RouterNavigationStackItem";
import type { RefObject } from "react";
import type { RouterState } from "./types";

interface RouterStateHandlerArgs {
    maxStackItems: number;
}

export default class RouterStateHandler {
    private maxStackItems: number;
    public routerState: RouterState;

    private listeners: Set<() => void>;

    constructor({maxStackItems}: RouterStateHandlerArgs) {
        this.maxStackItems = maxStackItems;

        this.routerState = {
            routerCache: {},
            navigationStack: [],
        };

        this.listeners = new Set();
    }

    public subscribeTo = (listener: () => void) => {
        this.listeners.add(listener);

        return () => this.listeners.delete(listener);
    };

    private emitChange = () => {
        this.listeners.forEach((l) => l(this.routerState));
    };

    public updateNavigationStack = (
        routeUUID?: string,
        originDirection?: NavigationTransitionDirection,
    ) => {
        if (!routeUUID) {
            return;
        }

        if (this.routerState.navigationStack.at(-1)?.routeUUID === routeUUID) {
            return;
        }

        const len = this.routerState.navigationStack.push({
            routeUUID: routeUUID,
            originDirection: originDirection,
        });

        if (len + 1 > this.maxStackItems) {
            this.routerState.navigationStack.shift();
        }

        this.emitChange();
    };

    public addToRouterCache = (
        uuid: string,
        ref: RefObject<HTMLDivElement | null> | null,
    ) => {
        if (Object.keys(this.routerState.routerCache).includes(uuid)) {
            return;
        }

        this.routerState.routerCache = {
            ...this.routerState.routerCache,
            [uuid]: { ref },
        };

        this.emitChange();
    };

    public markRouteAsRemovableFromCache = (uuid: string) => {
        if (!Object.keys(this.routerState.routerCache).includes(uuid)) {
            return;
        }

        const currentRoute = this.routerState.routerCache[uuid];

        this.routerState.routerCache = {
            ...this.routerState.routerCache,
            [uuid]: { ...currentRoute, markedForRemoval: true },
        };

        this.emitChange();
    };

    public removeFromRouterCache = (uuid: string) => {
        if (!Object.keys(this.routerState.routerCache).includes(uuid)) {
            return;
        }

        this.routerState.navigationStack =
            this.routerState.navigationStack.filter(
                (i) => i.routeUUID !== uuid,
            );

        delete this.routerState.routerCache[uuid];

        this.emitChange();
    };

    public clearRouterCache = () => {
        this.routerState.routerCache = {};
        this.emitChange();
    };

    public setNavigationStack = (stack: RouterNavigationStackItem[]) => {
        this.routerState.navigationStack = stack;
        this.emitChange();
    };
}
