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

export default function Router({ children }: PropsWithChildren) {
    const [routes, setRoutes] = useState<RouterData[]>([]);
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
        // url matching simplified for now
        for (const route of routes) {
            if (!route.url) {
                continue;
            }

            if (route.url === currentPath) {
                return route.uuid;
            }
        }

        // find catch all route
        return routes.find((r) => !r.url)?.uuid;
    }, [currentPath, routes]);

    const __addRoute = useCallback(
        (route: RouteData) => {
            const currentRoute = routes.find((r) => r.url === route.url);

            if (!currentRoute) {
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
        }
    }, [currentRoute, currentPath])

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
