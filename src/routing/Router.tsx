import { useMemo } from "react"
import { RouterContext } from "./context"
import type RouterData from "../types/RouteData"
import type RouterContextType from "../types/RouterContextType"

interface RouterProps {
    readonly routes: RouterData[];
}

export default function Router({routes}: RouterProps) {
    const values: RouterContextType = useMemo(() => {
        return {
            
        }
    }, [])

    return <RouterContext.Provider value={values}>
        {routes[0].component}
    </RouterContext.Provider>
}
