import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react"
import { RouterContext } from "./context"
import type RouterData from "../types/RouteData"
import type RouterContextType from "../types/RouterContextType"

export default function Router({ children }: PropsWithChildren) {
    const [routes, setRoutes] = useState<RouterData[]>([])
    const [path, setPath] = useState(window.location.pathname);

    const __handleNavEvent = useCallback(() => {
        const newPath = window.location.pathname;
        setPath(newPath);
    }, [])

    useEffect(() => {
        window.addEventListener('popstate', __handleNavEvent);

        return () => {
            window.removeEventListener('popstate', __handleNavEvent);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addRoute = useCallback((route: RouterData) => {
        const currentRoute = routes.find((r) => r.url === route.url)

        if (!currentRoute) {
            setRoutes(current => [...current, route])
        }
    }, [routes])

    const navigateTo = useCallback((url: string) => {
        window.history.pushState({}, '', url);
        window.dispatchEvent(new PopStateEvent('popstate'));
    }, [])

    const values: RouterContextType = useMemo(() => {
        return {
            addRoute,
            path,
            navigateTo,
        }
    }, [addRoute, path, navigateTo])

    return <RouterContext.Provider value={values}>
        {children}
    </RouterContext.Provider>
}
