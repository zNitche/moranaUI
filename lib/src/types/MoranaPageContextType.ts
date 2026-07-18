import type { RefObject } from "react";
import type { PageStructuralComponentType } from "./PageStructuralComponentType";

export default interface MoranaPageContextType {
    pageStructuralComponentsRegistry: {
        header: RefObject<HTMLDivElement | null> | null;
        content: RefObject<HTMLDivElement | null> | null;
        footer: RefObject<HTMLDivElement | null> | null;
    };
    updatePageStructuralComponentsRegistry: (
        type: PageStructuralComponentType,
        ref: RefObject<HTMLDivElement | null>,
    ) => void;
}
