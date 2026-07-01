import type MoranaAppContextType from "@root/types/MoranaAppContextType";
import type MoranaPageContextType from "@root/types/MoranaPageContextType";
import type { PageStructuralComponentType } from "@root/types/PageStructuralComponentType";
import { createContext, type RefObject } from "react";

export const MoranaAppContext = createContext<MoranaAppContextType>({
    navAnimationBuilder: undefined,
});

export const MoranaPageContext = createContext<MoranaPageContextType>({
    updatePageStructuralComponentsRegistry: (
        _type: PageStructuralComponentType,
        _ref: RefObject<HTMLDivElement | null> | null,
    ) => undefined,
    pageStructuralComponentsRegistry: {
        header: null,
        content: null,
    },
    shouldAnimatePage: true,
});
