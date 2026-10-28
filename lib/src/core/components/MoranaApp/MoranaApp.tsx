import { useMemo, useState, type PropsWithChildren } from "react";
import type MoranaAppContextType from "#root/types/MoranaAppContextType";
import { MoranaAppContext } from "#root/core/context";
import { defaultSlideNavAnimationBuilder } from "#root/viewTransitions/defaults";

// interface MoranaAppProps {}

export default function MoranaApp({
    children,
}: PropsWithChildren) {
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);

    const values: MoranaAppContextType = useMemo(() => {
        return {
            navAnimationBuilder: defaultSlideNavAnimationBuilder,
            isNavbarVisible,
            setIsNavbarVisible,
        };
    }, [isNavbarVisible]);

    return (
        <MoranaAppContext.Provider value={values}>
            {children}
        </MoranaAppContext.Provider>
    );
}
