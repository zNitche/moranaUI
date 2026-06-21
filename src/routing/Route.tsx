import { useEffect, useMemo } from "react";
import useRouter from "./hooks/useRouter";
import { generateUUID } from "../utils";

interface RouteProps {
    readonly url?: string;
    readonly component: React.ComponentType;
}

export default function Route({ url, component }: RouteProps) {
    const routeUUID = useMemo(() => generateUUID(), [])

    const { addRoute, currentRoute } = useRouter();

    useEffect(() => {
        addRoute({ uuid: routeUUID, url, component })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (routeUUID !== currentRoute) {
        return null;
    }

    const Component = component

    return <Component />;
}