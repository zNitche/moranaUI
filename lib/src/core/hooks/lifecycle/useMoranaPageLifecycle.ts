import { useEffect, useLayoutEffect, useRef } from "react";
import useRouteContext from "#root/routing/hooks/useRouteContext";

interface MoranaPageLifecycleProps {
    readonly onEnterCallback?: () => void;
    readonly onExitCallback?: () => void;
    readonly onMountCallback?: () => void;
    readonly onUnmountCallback?: () => void;
}

export default function useMoranaPageLifecycle({
    onEnterCallback,
    onExitCallback,
    onMountCallback,
    onUnmountCallback,
}: MoranaPageLifecycleProps) {
    const mountCallbackCalledRef = useRef<{ mount: boolean; unmount: boolean }>(
        {
            mount: false,
            unmount: false,
        },
    );
    const { registerLifecycleHook } = useRouteContext();

    useEffect(() => {
        if (!mountCallbackCalledRef.current.mount) {
            onMountCallback?.();
            mountCallbackCalledRef.current.mount = true;
        }

        return () => {
            if (!mountCallbackCalledRef.current.unmount) {
                onUnmountCallback?.();
                // eslint-disable-next-line react-hooks/exhaustive-deps
                mountCallbackCalledRef.current.unmount = true;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useLayoutEffect(() => {
        if (onEnterCallback) {
            registerLifecycleHook("enter", onEnterCallback);
        }

        if (onExitCallback) {
            registerLifecycleHook("exit", onExitCallback);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
