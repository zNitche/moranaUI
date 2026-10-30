import type { RefObject } from "react";

export type RouterCache = Record<
    string,
    {
        ref: RefObject<HTMLElement | null> | null;
        markedForRemoval?: boolean;
    }
>;
