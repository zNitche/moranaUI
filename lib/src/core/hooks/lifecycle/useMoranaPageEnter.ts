import { useLayoutEffect } from "react";
import useRouteContext from "@root/routing/hooks/useRouteContext";

interface MoranaPageEnterProps {
    readonly callback: () => void;
}

export default function useMoranaPageEnter({ callback }: MoranaPageEnterProps) {
    const { registerLifecycleHook } = useRouteContext();

    useLayoutEffect(() => {
        registerLifecycleHook("enter", callback);
    }, []);
}
