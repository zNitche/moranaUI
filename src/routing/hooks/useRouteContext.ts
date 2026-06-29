import { useContext } from "react";
import { RouteContext } from "../context";

export default function useRouteContext() {
    const context = useContext(RouteContext);

    if (!context) {
        throw new Error(
            "useRouteContext can't be called outside Route context",
        );
    }

    return context;
}
