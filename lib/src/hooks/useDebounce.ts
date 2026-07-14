import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    type DependencyList,
} from "react";

interface HookUseDebounceProps {
    readonly callback: () => void;
    readonly delay: number;
    readonly dependencies?: DependencyList;
}

export default function useDebounce({
    callback,
    delay,
    dependencies,
}: HookUseDebounceProps) {
    const isReadyRef = useRef<boolean>(false);
    const callbackRef = useRef<() => void>(callback);

    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const clearDebounce = useCallback(() => {
        isReadyRef.current = false;
        clearTimeout(timeoutRef.current);
    }, []);

    const fireDebounce = useCallback(() => {
        clearDebounce();

        timeoutRef.current = setTimeout(() => {
            isReadyRef.current = true;
            callbackRef.current();
        }, delay);
    }, [clearDebounce, delay]);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useLayoutEffect(() => {
        fireDebounce();

        return () => {
            clearDebounce();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(fireDebounce, dependencies ?? []);

    return { clearDebounce };
}
