import { useContext } from "react";
import { RouterContext } from "../context";

export default function useRouterContext() {
    const context = useContext(RouterContext);

    if (!context) {
        throw new Error(
            "useRouterContext can't be called outside Router's context",
        );
    }

    return context;
}
