import { useMemo, type PropsWithChildren } from "react";
import classes from "./MorannaApp.module.css";
import type NavAnimationBuilder from "@root/types/NavAnimationBuilder";
import type MoranaAppContextType from "@root/types/MoranaAppContextType";
import { MoranaAppContext } from "@root/core/context";

const defaultNavAnimationBuilder: NavAnimationBuilder = {
    duration: 1,
    wrapperClassName: undefined,
    enterAnimation: classes.defaultEnterAnimation,
    exitAnimation: classes.defaultExitAnimation,
    animateWholePageOverride: true,
};

interface MoranaAppProps {
    navAnimationBuilder?: NavAnimationBuilder;
}

export default function MoranaApp({
    children,
    navAnimationBuilder = defaultNavAnimationBuilder,
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
