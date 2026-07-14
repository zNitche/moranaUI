import { useLayoutEffect } from "react";

interface HookUseRegisterOnScrollListener {
    readonly targetElement: HTMLElement | null;
    readonly callback: (event: Event) => void;
    readonly passive?: boolean;
}

export default function useRegisterOnScrollListener({
    targetElement,
    callback,
    passive = true,
}: HookUseRegisterOnScrollListener) {
    useLayoutEffect(() => {
        if (!targetElement) {
            return;
        }

        targetElement.addEventListener("scroll", callback, { passive });

        return () => {
            if (targetElement) {
                targetElement.removeEventListener("scroll", callback);
            }
        };
    }, [callback, passive, targetElement]);
}
