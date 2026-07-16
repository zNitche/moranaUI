import { useCallback, useEffect, useRef, useState } from "react";

export default function useResetContentScroll() {
    const [contentElement, setContentElement] = useState<HTMLElement | null>(
        null,
    );

    const contentElementRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        contentElementRef.current = contentElement;
    }, [contentElement]);

    const setContentElementRef = useCallback((elem: HTMLElement | null) => {
        setContentElement(elem);
    }, []);

    const resetScroll = useCallback(() => {
        if (!contentElementRef.current) {
            return;
        }

        contentElementRef.current.scrollTo({ behavior: "smooth", top: 0 });
    }, [contentElementRef]);

    return { resetScroll, setContentElementRef };
}
