import { useLayoutEffect } from "react";
import useMoranaPageContext from "../useMoranaPageContext";

interface MoranaPageEnterProps {
    readonly callback: () => void;
}

export default function useMoranaPageEnter({ callback }: MoranaPageEnterProps) {
    const { registerLifecycleHook } = useMoranaPageContext();

    useLayoutEffect(() => {
        registerLifecycleHook("enter", callback);
    }, []);
}
