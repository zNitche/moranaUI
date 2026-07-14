import clamp from "@root/utils/clamp";
import { useCallback, useEffect, useRef, useState } from "react";
import useRegisterOnScrollListener from "./common/useRegisterOnScrollListener";

export default function useTrackScrollProgress() {
    const [targetElement, setTargetElement] = useState<HTMLElement | null>(
        null,
    );
    const [progress, setProgress] = useState<number | undefined>(undefined);

    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
        elementRef.current = targetElement;
    }, [targetElement]);

    const setRef = useCallback((e: HTMLElement | null) => {
        setTargetElement(e);
    }, []);

    const onScroll = useCallback((_event: Event) => {
        const elem = elementRef.current;

        if (!elem) {
            return;
        }

        const rawP =
            (elem.scrollTop * 100) / (elem.scrollHeight - elem.clientHeight);
        const p = Math.floor(clamp(rawP, 0, 100));

        setProgress(p);
    }, []);

    useRegisterOnScrollListener({
        targetElement,
        callback: onScroll,
        passive: true,
    });

    return { scrollProgress: progress, setRef };
}
