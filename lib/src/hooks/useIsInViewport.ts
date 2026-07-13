import { useCallback, useLayoutEffect, useMemo, useState } from "react";

export default function useIsInViewport() {
    const [refElement, setRefElement] = useState<HTMLElement | null>(null);

    const [observerEntry, setObserverEntry] = useState<
        IntersectionObserverEntry | undefined
    >();

    const setRef = useCallback((e: HTMLElement | null) => {
        setRefElement(e);
    }, []);

    const observerInitHandler = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            setObserverEntry(entries.at(0));
        },
        [],
    );

    useLayoutEffect(() => {
        if (!refElement) {
            return;
        }

        const observer = new IntersectionObserver(observerInitHandler);
        observer.observe(refElement);

        return () => {
            setObserverEntry(undefined);
            observer.disconnect();
        };
    }, [observerInitHandler, refElement]);

    const intersectionDetails = useMemo(() => {
        if (!observerEntry) {
            return;
        }

        return {
            isIntersecting: observerEntry.isIntersecting,
            intersectionRatio: observerEntry.intersectionRatio,
        };
    }, [observerEntry]);

    return { setRef, intersectionDetails };
}
