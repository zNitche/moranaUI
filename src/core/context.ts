import type MoranaAppContextType from "@root/types/MoranaAppContextType";
import { createContext } from "react";

export const MoranaAppContext = createContext<MoranaAppContextType>({
    navAnimationBuilder: undefined,
});
