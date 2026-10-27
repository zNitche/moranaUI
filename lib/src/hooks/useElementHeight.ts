import { useLayoutEffect, useState } from "react";

export default function useElementHeight() {
    const [elementRef, setElementRef] = useState<HTMLElement | null>(
        null,
    );
    const [height, setHeight] = useState<number | undefined>();

    useLayoutEffect(() => {
        if (!elementRef) {
            return;
        }

        const observer = new ResizeObserver(() =>
            setHeight(elementRef.clientHeight),
        );
        observer.observe(elementRef);

        return () => observer.disconnect();
    }, [elementRef]);

    return { setElementRef, elementHeight: height };
}
