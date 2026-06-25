import { useContext } from "react";
import { RouterContext } from "../context";

export default function usePathParams<T>() {
    const context = useContext(RouterContext);

    if (!context) {
        throw new Error(
            "usePathParams can't be called outside Router's context",
        );
    }

    const params = context.router?.currentRoute?.pathParams;

    return params ? (params as T) : null;
}
