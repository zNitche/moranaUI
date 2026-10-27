import {
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
    type PropsWithChildren,
} from "react";
import type RouteData from "../types/RouteData";
import type RouterContextType from "../types/RouterContextType";
import { matchTokenizedUrl, tokenizeUrl } from "../utils/url";
import type RouterCurrentRoute from "../types/RouterCurrentRoute";
import type RouterProps from "../types/RouterProps";
import { RouterContext } from "./context";
import RouterContent from "./components/RouterContent/RouterContent";
import type { RouterPath } from "#root/types/RouterPath";
import type { NavigationTransitionDirection } from "#root/types/NavigationTransitionDirection";
import type { RouterState } from "#root/external/types";
import RouterStateHandler from "#root/external/RouterStateHandler";

// well could be implemented using useReducer, but let's go with it
const routerStateHandler = new RouterStateHandler({ maxStackItems: 3 });

export default function Router({ children }: PropsWithChildren) {
    const routerState: RouterState = useSyncExternalStore(
        routerStateHandler.subscribeTo,
        routerStateHandler.getState,
    );

    const [routes, setRoutes] = useState<RouteData[]>([]);
    const navigationReady = useRef<boolean>(true);

    const [currentPath, setCurrentPath] = useState<RouterPath>({
        path: window.location.pathname,
        search: window.location.search,
    });

    const __historyStateAction = useCallback(
        ({
            url,
            type,
            updateCurrentPath = false,
        }: {
            url: string | URL;
            type: "push" | "replace";
            updateCurrentPath?: boolean;
        }) => {
            switch (type) {
                case "push":
                    window.history.pushState({}, "", url);
                    break;

                case "replace":
                    window.history.replaceState({}, "", url);
                    break;

                default:
                    break;
            }

            if (updateCurrentPath) {
                setCurrentPath((current) => {
                    return { ...current, search: window.location.search };
                });
            }
        },
        [],
    );

    const __getCurrentRoute = useCallback(
        (path?: RouterPath) => {
            const responseData: RouterCurrentRoute = {};

            for (const route of routes) {
                if (route.url === "*") {
                    continue;
                }

                if (path && route.tokenizedUrl) {
                    const pathMatchData = matchTokenizedUrl(
                        route.tokenizedUrl,
                        path.path,
                    );

                    if (pathMatchData.isMatching) {
                        responseData.uuid = route.uuid;
                        responseData.pathParams = pathMatchData.pathParams;

                        break;
                    }
                }
            }

            responseData.uuid ??= routes.find((r) => r.url === "*")?.uuid;
            return responseData;
        },
        [routes],
    );

    const currentRoute: RouterCurrentRoute = useMemo(
        () => __getCurrentRoute(currentPath),
        [__getCurrentRoute, currentPath],
    );

    useLayoutEffect(() => {
        routerStateHandler.updateNavigationStack(
            currentRoute.uuid,
            currentPath.originDirection,
        );
    }, [currentPath.originDirection, currentRoute.uuid]);

    const __handleNavEvent = useCallback((event: PopStateEvent) => {
        setCurrentPath({
            path: window.location.pathname,
            search: window.location.search,
            originDirection: event.state?.originDirection,
        });

        navigationReady.current = false;

        queueMicrotask(() =>
            setTimeout(() => {
                navigationReady.current = true;
            }, 1000),
        );
    }, []);

    useLayoutEffect(() => {
        window.addEventListener("popstate", __handleNavEvent);

        return () => {
            window.removeEventListener("popstate", __handleNavEvent);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const __addRoute = useCallback((route: RouteData) => {
        setRoutes((current) => {
            if (route.url && route.url !== "*") {
                route.tokenizedUrl = tokenizeUrl(route.url);
            }

            const currentRoute = current.find((r) => {
                if (r.uuid === route.uuid) {
                    return r;
                }

                if (r.url === route.url) {
                    return r;
                }
            });

            if (currentRoute) {
                return current;
            }

            return [...current, route];
        });
    }, []);

    const __replaceNavigationPath = ({
        inPlace = false,
    }: {
        inPlace: boolean;
    }) => {
        const currentUrl = new URL(window.location.href);

        if (!inPlace) {
            setCurrentPath((current) => {
                return {
                    ...current,
                    path: currentUrl.pathname,
                    search: currentUrl.search,
                };
            });
        }
    };

    const clearRouterCache = useCallback(() => {
        routerStateHandler.clearRouterCache();

        if (currentRoute.uuid) {
            routerStateHandler.setNavigationStack([
                { routeUUID: currentRoute.uuid },
            ]);
        }

        __replaceNavigationPath({ inPlace: false });
    }, [currentRoute.uuid]);

    const navigateTo = useCallback(
        ({
            path,
            replace,
            popFromCache,
            direction,
        }: {
            path: string;
            replace?: boolean;
            popFromCache?: boolean;
            direction?: NavigationTransitionDirection;
        }) => {
            if (path === currentPath.path) {
                return;
            }

            if (!navigationReady.current) {
                return;
            }

            if (replace) {
                __historyStateAction({
                    url: path,
                    type: "replace",
                });
                clearRouterCache();
            } else {
                __historyStateAction({
                    url: path,
                    type: "push",
                });
            }

            if (popFromCache && currentRoute.uuid) {
                routerStateHandler.markRouteAsRemovableFromCache(
                    currentRoute.uuid,
                );
            }

            window.dispatchEvent(
                new PopStateEvent("popstate", {
                    state: { originDirection: direction },
                }),
            );
        },
        [
            currentPath.path,
            currentRoute.uuid,
            __historyStateAction,
            clearRouterCache,
        ],
    );

    const navigateBack = useCallback(
        ({ popFromCache }: { popFromCache?: boolean }) => {
            if (routerState.navigationStack.length > 1) {
                if (popFromCache && currentRoute.uuid) {
                    routerStateHandler.markRouteAsRemovableFromCache(
                        currentRoute.uuid,
                    );
                }

                window.history.back();
            } else {
                navigateTo({
                    path: "/",
                    direction: "back",
                    popFromCache,
                });
            }
        },
        [routerState.navigationStack.length, currentRoute.uuid, navigateTo],
    );

    const replaceSearchParams = useCallback(
        ({
            add,
            remove,
        }: {
            add?: Record<string, string>;
            remove?: string[];
        }) => {
            const currentUrl = new URL(window.location.href);
            const currentSearchParams = new URLSearchParams(currentUrl.search);

            if (remove) {
                for (const key of remove) {
                    currentSearchParams.delete(key);
                }
            }

            if (add) {
                for (const key of Object.keys(add)) {
                    currentSearchParams.set(key, add[key]);
                }
            }

            currentUrl.search = currentSearchParams.toString();
            __historyStateAction({
                url: currentUrl,
                type: "replace",
                updateCurrentPath: true,
            });

            __replaceNavigationPath({ inPlace: true });
        },
        [__historyStateAction],
    );

    const getRouteUUIDByName = useCallback(
        (name: string) => {
            return routes.find((r) => r.name === name)?.uuid;
        },
        [routes],
    );

    const router: RouterProps = useMemo(() => {
        return {
            currentRoute: currentRoute,
            path: currentPath.path,
            search: currentPath.search,
            navigationStack: routerState.navigationStack,
        };
    }, [
        currentRoute,
        currentPath.path,
        currentPath.search,
        routerState.navigationStack,
    ]);

    const values: RouterContextType = useMemo(() => {
        return {
            __addRoute,
            clearRouterCache,
            __addToRouterCache: routerStateHandler.addToRouterCache,
            __removeFromRouterCache: routerStateHandler.removeFromRouterCache,
            router,
            navigateTo,
            navigateBack,
            routerCache: routerState.routerCache,
            getRouteUUIDByName,
            replaceSearchParams,
        };
    }, [
        __addRoute,
        clearRouterCache,
        router,
        navigateTo,
        navigateBack,
        routerState.routerCache,
        getRouteUUIDByName,
        replaceSearchParams,
    ]);

    return (
        <RouterContext.Provider value={values}>
            <RouterContent>{children}</RouterContent>
        </RouterContext.Provider>
    );
}
