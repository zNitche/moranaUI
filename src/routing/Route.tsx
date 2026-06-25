import {
    Fragment,
    useEffect,
    useMemo,
    type ComponentType,
    type ReactNode,
} from "react";
import { generateUUID } from "../utils";
import useRouterContext from "./hooks/useRouterContext";

interface RouteProps {
    readonly url: string;
    readonly component: ComponentType;
    readonly wrapper?: ComponentType<{ children: ReactNode }>;
}

export default function Route({
    url,
    component,
    wrapper = Fragment,
}: RouteProps) {
    const routeUUID = useMemo(() => generateUUID(), []);

    const { __addRoute, router } = useRouterContext();

    useEffect(() => {
        __addRoute({ uuid: routeUUID, url, component });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (routeUUID !== router.currentRoute?.uuid) {
        return null;
    }

    const Component = component;
    const Wrapper = wrapper;

    return (
        <Wrapper>
            <Component />
        </Wrapper>
    );
}
