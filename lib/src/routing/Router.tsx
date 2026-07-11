import {
    useCallback,
    useLayoutEffect,
    useMemo,
    useState,
    type PropsWithChildren,
    type RefObject,
} from "react";
import type RouteData from "../types/RouteData";
import type RouterContextType from "../types/RouterContextType";
import { matchTokenizedUrl, tokenizeUrl } from "../utils/url";
import type RouterCurrentRoute from "../types/RouterCurrentRoute";
import type RouterProps from "../types/RouterProps";
import { RouterContext } from "./context";
import type { RouterCache } from "@root/types/RouterCache";
import type RouterNavigationStackItem from "@root/types/RouterNavigationStackItem";
import RouterContent from "./components/RouterContent/RouterContent";
import type { RouterPath } from "@root/types/RouterPath";
import type { NavigationTransitionDirection } from "@root/types/NavigationTransitionDirection";

export default function Router({ children }: PropsWithChildren) {
    const [routes, setRoutes] = useState<RouteData[]>([]);

    const [routerCache, setRouterCache] = useState<RouterCache>({});
    const [navigationStack, setNavigationStack] = useState<
        RouterNavigationStackItem[]
    >([]);

    const [canNavigate, setCanNavigate] = useState(true);

    const [currentPath, setCurrentPath] = useState<RouterPath>({
        path: window.location.pathname,
        search: window.location.search,
    });

    const __updateNavigationStack = useCallback(
        (
            routeUUID: string | undefined,
            originDirection?: NavigationTransitionDirection,
        ) => {
            const MAX_STACK_ITEMS = 4;

            if (!routeUUID) {
                return;
            }

            setNavigationStack((current) => {
                if (current.at(-1)?.routeUUID === routeUUID) {
                    return current;
                }

                const len = current.push({
                    routeUUID: routeUUID,
                    originDirection: originDirection,
                });

                if (len + 1 > MAX_STACK_ITEMS) {
                    current.shift();
                }

                return current;
            });
        },
        [setNavigationStack],
    );

    const __popFromRouterCache = useCallback(
        (routeUUID: string) => {
            setRouterCache((current) => {
                const output: RouterCache = {};

                for (const [key, val] of Object.entries(current)) {
                    if (key !== routeUUID) {
                        output[key] = val;
                    }
                }

                return output;
            });
        },
        [setRouterCache],
    );

    const __addToRouterCache = useCallback(
        (uuid: string, ref: RefObject<HTMLDivElement | null> | null) => {
            if (Object.keys(routerCache).includes(uuid)) {
                return;
            }

            queueMicrotask(() =>
                setRouterCache((current) => {
                    return { ...current, [uuid]: ref };
                }),
            );
        },
        [routerCache],
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

    const currentRoute: RouterCurrentRoute = useMemo(() => {
        const responseData: RouterCurrentRoute = __getCurrentRoute(currentPath);

        __updateNavigationStack(
            responseData.uuid,
            currentPath?.originDirection,
        );

        return responseData;
    }, [__getCurrentRoute, __updateNavigationStack, currentPath]);

    const __handleNavEvent = useCallback((event: PopStateEvent) => {
        setCurrentPath({
            path: window.location.pathname,
            search: window.location.search,
            originDirection: event.state?.originDirection,
        });

        setCanNavigate(false);

        queueMicrotask(() => setTimeout(() => setCanNavigate(true), 1000));
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

    const clearRouterCache = useCallback(() => {
        setRouterCache({});

        if (currentRoute.uuid) {
            setNavigationStack([{ routeUUID: currentRoute.uuid }]);
        }
    }, [currentRoute]);

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
            if (!canNavigate) {
                return;
            }

            if (replace) {
                clearRouterCache();
                window.history.replaceState({}, "", path);
            } else {
                window.history.pushState({}, "", path);
            }

            if (popFromCache) {
                if (currentRoute.uuid) {
                    __popFromRouterCache(currentRoute.uuid);
                }
            }

            window.dispatchEvent(
                new PopStateEvent("popstate", {
                    state: { originDirection: direction },
                }),
            );
        },
        [canNavigate, clearRouterCache, currentRoute, __popFromRouterCache],
    );

    const navigateBack = useCallback(() => {
        window.history.back();
    }, []);

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
            navigationStack: navigationStack,
        };
    }, [currentRoute, currentPath, navigationStack]);

    const values: RouterContextType = useMemo(() => {
        return {
            __addRoute,
            clearRouterCache,
            __addToRouterCache,
            router,
            navigateTo,
            navigateBack,
            routerCache,
            getRouteUUIDByName,
        };
    }, [
        __addRoute,
        navigateTo,
        navigateBack,
        router,
        routerCache,
        __addToRouterCache,
        clearRouterCache,
        getRouteUUIDByName,
    ]);

    return (
        <RouterContext.Provider value={values}>
            <RouterContent>{children}</RouterContent>
        </RouterContext.Provider>
    );
}
