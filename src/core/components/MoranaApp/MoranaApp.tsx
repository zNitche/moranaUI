import { useMemo, type PropsWithChildren } from "react";
import type NavAnimationBuilder from "@root/types/NavAnimationBuilder";
import type MoranaAppContextType from "@root/types/MoranaAppContextType";
import { MoranaAppContext } from "@root/core/context";
import { defaultSlideNavAnimationBuilder } from "@root/navAnimationBuilder/defaults";

interface MoranaAppProps {
    navAnimationBuilder?: NavAnimationBuilder;
}

export default function MoranaApp({
    children,
    navAnimationBuilder = defaultSlideNavAnimationBuilder,
}: PropsWithChildren<MoranaAppProps>) {
    const values: MoranaAppContextType = useMemo(() => {
        return { navAnimationBuilder };
    }, [navAnimationBuilder]);

    return (
        <MoranaAppContext.Provider value={values}>
            {children}
        </MoranaAppContext.Provider>
    );
}
