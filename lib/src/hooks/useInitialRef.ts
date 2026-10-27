import { useEffect, useRef } from "react";

export default function useInitialRef<T>(value: T) {
    const ref = useRef<T>(value);

    useEffect(() => {
        if (!ref.current) {
            ref.current = value;
        }
    }, [value]);

    return ref;
}
