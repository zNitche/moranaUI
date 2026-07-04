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
import type RouterNavigationStackItem from "@root/types/RouterNavigationStack";

export default function Router({ children }: PropsWithChildren) {
    const [routes, setRoutes] = useState<RouteData[]>([]);

    const [routerCache, setRouterCache] = useState<RouterCache>({});
    const [navigationStack, setNavigationStack] = useState<
        RouterNavigationStackItem[]
    >([]);

    const [canNavigate, setCanNavigate] = useState(true);

    const [currentPath, setCurrentPath] = useState<{
        path: string;
        search?: string;
    }>({
        path: window.location.pathname,
        search: window.location.search,
    });

    const __updateNavigationStack = useCallback(
        (routeUUID: string | undefined) => {
            const MAX_STACK_ITEMS = 10;

            if (!routeUUID) {
                return;
            }

            setNavigationStack((current) => {
                if (current.at(-1)?.routeUUID === routeUUID) {
                    return current;
                }

                const len = current.push({ routeUUID: routeUUID });

                if (len + 1 > MAX_STACK_ITEMS) {
                    current.shift();
                }

                return current;
            });
        },
        [setNavigationStack],
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

    const clearRouterCache = useCallback(() => setRouterCache({}), []);

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

        __updateNavigationStack(responseData.uuid);

        return responseData;
    }, [currentPath, routes, __updateNavigationStack]);

    const __handleNavEvent = useCallback(() => {
        setCurrentPath({
            path: window.location.pathname,
            search: window.location.search,
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
            if (!canNavigate) {
                return;
            }

            if (replace) {
                setRouterCache({});
                window.history.replaceState({}, "", path);
            } else {
                window.history.pushState({}, "", path);
            }

            window.dispatchEvent(new PopStateEvent("popstate"));
        },
        [canNavigate],
    );

    const navigateBack = useCallback(() => {
        window.history.back();
    }, []);

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
