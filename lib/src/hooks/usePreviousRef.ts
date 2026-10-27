import { useEffect, useRef } from "react";

export default function useLatestRef<T>(value: T) {
    const ref = useRef<T>(value);

    useEffect(() => {
        ref.current = value;
    });

    return ref;
}
