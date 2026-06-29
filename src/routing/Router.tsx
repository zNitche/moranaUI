import {
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type PropsWithChildren,
} from "react";
import type RouteData from "../types/RouteData";
import type RouterContextType from "../types/RouterContextType";
import { matchTokenizedUrl, tokenizeUrl } from "../utils/url";
import type RouterCurrentRoute from "../types/RouterCurrentRoute";
import type RouterProps from "../types/RouterProps";
import { RouterContext } from "./context";
import useMoranaAppContext from "@root/core/hooks/useMoranaAppContext";
import type { RouterCache } from "@root/types/RouterCache";
import type NavigationState from "@root/types/NavigationState";

export default function Router({ children }: PropsWithChildren) {
    const [routes, setRoutes] = useState<RouteData[]>([]);
    const [routerCache, setRouterCache] = useState<RouterCache>([]);

    const currentRouteRef = useRef<RouterCurrentRoute>(null);

    const [navigationState, setNavigationState] = useState<
        NavigationState | undefined
    >(undefined);

    const [currentPath, setCurrentPath] = useState<{
        path: string;
        search?: string;
    }>({
        path: window.location.pathname,
        search: window.location.search,
    });

    const { navAnimationBuilder } = useMoranaAppContext();

    const __addToRouterCache = useCallback(
        (uuid: string) => {
            if (routerCache.includes(uuid)) {
                return;
            }

            queueMicrotask(() =>
                setRouterCache((current) => {
                    return [...current, uuid];
                }),
            );
        },
        [routerCache],
    );

    const clearRouterCache = useCallback(() => setRouterCache([]), []);

    const currentRoute: RouterCurrentRoute = useMemo(() => {
        const responseData: RouterCurrentRoute = {};

        for (const route of routes) {
            if (route.url === "*") {
                continue;
            }

            if (currentPath && route.tokenizedUrl) {
                const pathMatchData = matchTokenizedUrl(
                    route.tokenizedUrl,
                    currentPath.path,
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
    }, [currentPath, routes]);

    // sync currentRoute Ref
    useLayoutEffect(() => {
        currentRouteRef.current = currentRoute;        
    }, [currentRoute]);

    const __handleNavEvent = useCallback(() => {
        if (navigationState !== undefined) {
            return;
        }

        setNavigationState({
            type: "exit",
            target: currentRouteRef.current?.uuid,
        });

        setTimeout(
            () => {
                setCurrentPath({
                    path: window.location.pathname,
                    search: window.location.search,
                });
            },
            navAnimationBuilder?.duration ?? 200,
        );
    }, [navAnimationBuilder?.duration, navigationState]);

    // clean animation state
    useLayoutEffect(() => {
        if (navigationState === undefined) {
            return;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNavigationState({
            type: "enter",
            target: currentRoute.uuid,
        });

        setTimeout(
            () => setNavigationState(undefined),
            navAnimationBuilder?.duration
                ? navAnimationBuilder.duration * 2 + 1500
                : 1500,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPath]);

    useLayoutEffect(() => {
        window.addEventListener("popstate", __handleNavEvent);

        return () => {
            window.removeEventListener("popstate", __handleNavEvent);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const __addRoute = useCallback(
        (route: RouteData) => {
            const currentRoute = routes.find((r) => r.url === route.url);

            if (!currentRoute) {
                if (route.url && route.url !== "*")
                    route.tokenizedUrl = tokenizeUrl(route.url);

                setRoutes((current) => [...current, route]);
            }
        },
        [routes],
    );

    const navigateTo = useCallback(
        ({ path, replace }: { path: string; replace?: boolean }) => {
            if (replace) {
                setRouterCache([]);
                window.history.replaceState({}, "", path);
            } else {
                window.history.pushState({}, "", path);
            }

            window.dispatchEvent(new PopStateEvent("popstate"));
        },
        [],
    );

    const navigateBack = useCallback(() => {
        window.history.back();
    }, []);

    const router: RouterProps = useMemo(() => {
        return {
            currentRoute: currentRoute,
            path: currentPath.path,
            search: currentPath.search,
            navigationState: navigationState,
        };
    }, [currentRoute, currentPath, navigationState]);

    const values: RouterContextType = useMemo(() => {
        return {
            __addRoute,
            clearRouterCache,
            __addToRouterCache,
            router,
            navigateTo,
            navigateBack,
            routerCache,
        };
    }, [
        __addRoute,
        navigateTo,
        navigateBack,
        router,
        routerCache,
        __addToRouterCache,
        clearRouterCache,
    ]);

    return (
        <RouterContext.Provider value={values}>
            {children}
        </RouterContext.Provider>
    );
}
