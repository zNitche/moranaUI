import { useContext, useMemo } from "react";
import { RouterContext } from "../context";

// add route info here so cached pages doesn't have it rerendered
export default function useSearchParams<T>() {
    const context = useContext(RouterContext);

    const params = useMemo(() => {
        if (!context) {
            throw new Error(
                "useSearchParams can't be called outside Router's context",
            );
        }

        if (!context.router?.search) {
            return;
        }

        const searchParams = new URLSearchParams(context.router.search);

        return Object.fromEntries(searchParams) as T;
    }, [context]);

    return params;
}
