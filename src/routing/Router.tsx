import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type PropsWithChildren,
} from "react";
import { RouterContext } from "./context";
import type RouteData from "../types/RouteData";
import type RouterContextType from "../types/RouterContextType";
import { matchTokenizedUrl, tokenizeUrl } from "../utils/url";

export default function Router({ children }: PropsWithChildren) {
    const [routes, setRoutes] = useState<RouteData[]>([]);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    const __handleNavEvent = useCallback(() => {
        setCurrentPath(window.location.pathname);
    }, []);

    useEffect(() => {
        window.addEventListener("popstate", __handleNavEvent);

        return () => {
            window.removeEventListener("popstate", __handleNavEvent);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currentRoute = useMemo(() => {
        for (const route of routes) {
            if (route.url === "*") {
                continue;
            }

            if (currentPath && route.tokenizedUrl) {
                if (matchTokenizedUrl(route.tokenizedUrl, currentPath)) {
                    return route.uuid;
                }
            }
        }

        return routes.find((r) => r.url === "*")?.uuid;
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

    const navigateTo = useCallback((url: string) => {
        window.history.pushState({}, "", url);
        window.dispatchEvent(new PopStateEvent("popstate"));
    }, []);

    const navigateBack = useCallback(() => {
        window.history.back();
    }, []);

    const router = useMemo(() => {
        return {
            currentRoute: currentRoute,
            path: currentPath,
        };
    }, [currentRoute, currentPath]);

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
