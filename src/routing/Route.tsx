import { useEffect } from "react";
import useRouter from "./hooks/useRouter";

interface RouteProps {
    readonly url?: string;
    readonly component: React.ComponentType;
}

export default function Route({url, component}: RouteProps) {
    const {addRoute, path} = useRouter();

    useEffect(() => {
        addRoute({url, component})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (url !== path) {
        return null;
    }

    const Component = component

    return <Component />;
}