import type { RefObject } from "react";

export type RouterCache = Record<
    string,
    {
        ref: RefObject<HTMLDivElement | null> | null;
        markedForRemoval?: boolean;
    }
>;
