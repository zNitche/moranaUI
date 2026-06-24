import { useEffect, useMemo } from "react";
import { generateUUID } from "../utils";
import useRouterContext from "./hooks/useRouterContext";

interface RouteProps {
    readonly url?: string;
    readonly component: React.ComponentType;
}

export default function Route({ url, component }: RouteProps) {
    const routeUUID = useMemo(() => generateUUID(), []);

    const { addRoute, router } = useRouterContext();

    useEffect(() => {
        addRoute({ uuid: routeUUID, url, component });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (routeUUID !== router.currentRoute) {
        return null;
    }

    const Component = component;

    return <Component />;
}
