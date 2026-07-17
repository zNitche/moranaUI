import { useMemo, useState, type PropsWithChildren } from "react";
import type NavAnimationBuilder from "@root/types/NavAnimationBuilder";
import type MoranaAppContextType from "@root/types/MoranaAppContextType";
import { MoranaAppContext } from "@root/core/context";
import {
    defaultSlideNavAnimationBuilder,
    defaultFadeNavAnimationBuilder,
} from "@root/navAnimationBuilder/defaults";

interface MoranaAppProps {
    navAnimationBuilder?: "slide" | "fade" | NavAnimationBuilder;
}

export default function MoranaApp({
    children,
    navAnimationBuilder = "slide",
}: PropsWithChildren<MoranaAppProps>) {
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);

    const animationBuilder = useMemo(() => {
        if (navAnimationBuilder === "fade") {
            return defaultFadeNavAnimationBuilder;
        }

        if (navAnimationBuilder === "slide") {
            return defaultSlideNavAnimationBuilder;
        }

        return navAnimationBuilder;
    }, [navAnimationBuilder]);

    const values: MoranaAppContextType = useMemo(() => {
        return {
            navAnimationBuilder: animationBuilder,
            isNavbarVisible,
            setIsNavbarVisible,
        };
    }, [isNavbarVisible, animationBuilder]);

    return (
        <MoranaAppContext.Provider value={values}>
            {children}
        </MoranaAppContext.Provider>
    );
}
