import { useMemo, type PropsWithChildren } from "react";
import { MoranaAppContext } from "./context";
import type NavAnimationBuilder from "@root/types/NavAnimationBuilder";
import type MoranaAppContextType from "@root/types/MoranaAppContextType";

interface MoranaAppProps {
    navAnimationBuilder?: NavAnimationBuilder;
}

export default function MoranaApp({
    children,
    navAnimationBuilder,
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
