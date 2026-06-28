import { useLayoutEffect } from "react";
import useMoranaPageContext from "../useMoranaPageContext";

interface MoranaPageExitProps {
    readonly callback: () => void;
}

export default function useMoranaPageExit({ callback }: MoranaPageExitProps) {
    const { registerLifecycleHook } = useMoranaPageContext();

    useLayoutEffect(() => {
        registerLifecycleHook("exit", callback);
    }, []);
}
