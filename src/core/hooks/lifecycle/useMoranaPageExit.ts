import { useLayoutEffect } from "react";
import useRouteContext from "@root/routing/hooks/useRouteContext";

interface MoranaPageExitProps {
    readonly callback: () => void;
}

export default function useMoranaPageExit({ callback }: MoranaPageExitProps) {
    const { registerLifecycleHook } = useRouteContext();

    useLayoutEffect(() => {
        registerLifecycleHook("exit", callback);
    }, []);
}
