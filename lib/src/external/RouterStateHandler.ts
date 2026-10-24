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

    constructor({ maxStackItems }: RouterStateHandlerArgs) {
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

    public getState = () => {
        return this.routerState;
    };

    private setState = ({
        partial,
        notify = true,
    }: {
        partial: Partial<RouterState>;
        notify?: boolean;
    }) => {
        // simple shallow copy via {...} won't trigger rerender
        // and structuredClone() doesn't work for refs, so we are left with it
        this.routerState = { ...this.routerState, ...partial };

        if (notify) {
            this.propagateChanges();
        }
    };

    private propagateChanges = () => {
        this.listeners.forEach((l) => l());
    };

    public updateNavigationStack = (
        routeUUID?: string,
        originDirection?: NavigationTransitionDirection,
    ) => {
        if (!routeUUID) {
            return;
        }

        const prevRouteUUID =
            this.routerState.navigationStack.at(-1)?.routeUUID;

        if (prevRouteUUID === routeUUID) {
            return;
        }

        const currentNavigationStack = [
            ...this.routerState.navigationStack,
            {
                routeUUID: routeUUID,
                originDirection: originDirection,
                previousRouteUUID: prevRouteUUID,
            },
        ];

        if (currentNavigationStack.length > this.maxStackItems) {
            currentNavigationStack.shift();
        }

        this.setState({ partial: { navigationStack: currentNavigationStack } });
    };

    public addToRouterCache = (
        uuid: string,
        ref: RefObject<HTMLDivElement | null> | null,
    ) => {
        if (Object.keys(this.routerState.routerCache).includes(uuid)) {
            return;
        }

        const cache = { ...this.routerState.routerCache, [uuid]: { ref } };

        this.setState({ partial: { routerCache: cache } });
    };

    public markRouteAsRemovableFromCache = (uuid: string) => {
        if (!Object.keys(this.routerState.routerCache).includes(uuid)) {
            return;
        }

        const currentRoute = this.routerState.routerCache[uuid];
        const routerCache = {
            ...this.routerState.routerCache,
            [uuid]: { ...currentRoute, markedForRemoval: true },
        };

        this.setState({ partial: { routerCache } });
    };

    public removeFromRouterCache = (uuid: string) => {
        if (!Object.keys(this.routerState.routerCache).includes(uuid)) {
            return;
        }

        const navigationStack = this.routerState.navigationStack.filter(
            (i) => i.routeUUID !== uuid,
        );

        const routerCache = { ...this.routerState.routerCache };
        delete routerCache[uuid];

        this.setState({ partial: { navigationStack, routerCache } });
    };

    public clearRouterCache = () => {
        this.setState({ partial: { routerCache: {} } });
    };

    public setNavigationStack = (
        navigationStack: RouterNavigationStackItem[],
    ) => {
        this.setState({ partial: { navigationStack } });
    };
}
