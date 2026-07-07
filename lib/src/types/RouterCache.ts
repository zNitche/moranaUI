import type { RefObject } from "react";

export type RouterCache = Record<
    string,
    RefObject<HTMLDivElement | null> | null
>;
