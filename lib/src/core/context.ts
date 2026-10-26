import type MoranaAppContextType from "#root/types/MoranaAppContextType";
import type MoranaPageContextType from "#root/types/MoranaPageContextType";
import { createContext } from "react";

export const MoranaAppContext = createContext<MoranaAppContextType | null>(
    null,
);

export const MoranaPageContext = createContext<MoranaPageContextType | null>(
    null,
);
