import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type PropsWithChildren,
} from "react";
import type RouteData from "../types/RouteData";
import type RouterContextType from "../types/RouterContextType";
import { matchTokenizedUrl, tokenizeUrl } from "../utils/url";
import type RouterCurrentRoute from "../types/RouterCurrentRoute";
import type RouterProps from "../types/RouterProps";
import type { NavigationState } from "../types/NavigationState";
import { RouterContext } from "./context";
import useMoranaAppContext from "@root/core/hooks/useMoranaAppContext";

export default function Router({ children }: PropsWithChildren) {
    const [routes, setRoutes] = useState<RouteData[]>([]);

    const [navigationState, setNavigationState] =
        useState<NavigationState>(undefined);

    const [currentPath, setCurrentPath] = useState<{
        path: string;
        search?: string;
    }>({
        path: window.location.pathname,
        search: window.location.search,
    });

    const { navAnimationBuilder } = useMoranaAppContext();

    const __handleNavEvent = useCallback(() => {
        if (navigationState !== undefined) {
            return;
        }

        setNavigationState("out");

        setTimeout(
            () => {
                setCurrentPath({
                    path: window.location.pathname,
                    search: window.location.search,
                });

                setNavigationState("in");
            },

            navAnimationBuilder?.duration ?? 200,
        );
    }, [navAnimationBuilder, navigationState]);

    // clean animation state
    useEffect(() => {
        if (navigationState === undefined) {
            return;
        }

        setTimeout(
            () => {
                setNavigationState(undefined);
            },

            navAnimationBuilder?.duration
                ? navAnimationBuilder.duration * 2 + 100
                : 500,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPath.path]);

    useEffect(() => {
        window.addEventListener("popstate", __handleNavEvent);

        return () => {
            window.removeEventListener("popstate", __handleNavEvent);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const navigateTo = useCallback((url: string, replace: boolean) => {
        if (replace) {
            window.history.replaceState({}, "", url);
        } else {
            window.history.pushState({}, "", url);
        }

        window.dispatchEvent(new PopStateEvent("popstate"));
    }, []);

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
            router,
            navigateTo,
            navigateBack,
        };
    }, [__addRoute, navigateTo, navigateBack, router]);

    return (
        <RouterContext.Provider value={values}>
            {children}
        </RouterContext.Provider>
    );
}
