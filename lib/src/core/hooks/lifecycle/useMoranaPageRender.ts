import { useLayoutEffect } from "react";
import useRouteContext from "@root/routing/hooks/useRouteContext";

interface MoranaPageRenderProps {
    readonly onMountCallback: () => void;
    readonly onUnmountCallback: () => void;
}

export default function useMoranaPageRender({ onMountCallback, onUnmountCallback }: MoranaPageRenderProps) {
    const { registerLifecycleHook } = useRouteContext();

    useLayoutEffect(() => {
        registerLifecycleHook("mount", onMountCallback);
        registerLifecycleHook("unmount", onUnmountCallback);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
