import type MoranaAppContextType from "@root/types/MoranaAppContextType";
import type MoranaPageContextType from "@root/types/MoranaPageContextType";
import { createContext } from "react";

export const MoranaAppContext = createContext<MoranaAppContextType>({
    navAnimationBuilder: undefined,
});

export const MoranaPageContext = createContext<MoranaPageContextType>({
    classForNavState: undefined,
    updatePageStructuralComponentsRegistry: (
        _type: "header" | "content",
        _val: boolean,
    ) => undefined,
    pageStructuralComponentsRegistry: {
        header: false,
        content: false,
    },
    shouldAnimatePage: true,
});
