import { useMemo, useState, type PropsWithChildren } from "react";
import type MoranaAppContextType from "#root/types/MoranaAppContextType";
import { MoranaAppContext } from "#root/core/context";
import { defaultSlideNavAnimationBuilder } from "#root/viewTransitions/defaults";

interface MoranaAppProps {
    navAnimationBuilder?: "slide" | "fade";
}

export default function MoranaApp({
    navAnimationBuilder = "slide",
    children,
}: PropsWithChildren<MoranaAppProps>) {
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);

    const animationBuilder = useMemo(() => {
        if (navAnimationBuilder === "slide") {
            return defaultSlideNavAnimationBuilder;
        }

        return defaultSlideNavAnimationBuilder;
    }, [navAnimationBuilder]);

    const values: MoranaAppContextType = useMemo(() => {
        return {
            navAnimationBuilder: animationBuilder,
            isNavbarVisible,
            setIsNavbarVisible,
        };
    }, [animationBuilder, isNavbarVisible]);

    return (
        <MoranaAppContext.Provider value={values}>
            {children}
        </MoranaAppContext.Provider>
    );
}
