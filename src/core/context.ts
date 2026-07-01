import type MoranaAppContextType from "@root/types/MoranaAppContextType";
import type MoranaPageContextType from "@root/types/MoranaPageContextType";
import type { PageStructuralComponentType } from "@root/types/PageStructuralComponentType";
import { createContext } from "react";

export const MoranaAppContext = createContext<MoranaAppContextType>({
    navAnimationBuilder: undefined,
});

export const MoranaPageContext = createContext<MoranaPageContextType>({
    updatePageStructuralComponentsRegistry: (
        _type: PageStructuralComponentType,
        _val: boolean,
    ) => undefined,
    pageStructuralComponentsRegistry: {
        header: false,
        content: false,
    },
    shouldAnimatePage: true,
});
