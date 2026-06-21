import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react"
import { RouterContext } from "./context"
import type RouterData from "../types/RouteData"
import type RouterContextType from "../types/RouterContextType"

export default function Router({ children }: PropsWithChildren) {
    const [routes, setRoutes] = useState<RouterData[]>([])
    const [path, setPath] = useState(window.location.pathname);

    const addRoute = useCallback((route: RouterData) => {
        const currentRoute = routes.find((r) => r.url === route.url)

        if (!currentRoute) {
            setRoutes(current => [...current, route])
        }
    }, [routes])

    const navigateTo = useCallback((url: string) => {
        return
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
