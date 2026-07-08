import type { Dispatch, SetStateAction } from "react";
import type NavAnimationBuilder from "./NavAnimationBuilder";

export default interface MoranaAppContextType {
    navAnimationBuilder?: NavAnimationBuilder;
    setIsNavbarVisible?: Dispatch<SetStateAction<boolean>>;
    isNavbarVisible: boolean;
}
