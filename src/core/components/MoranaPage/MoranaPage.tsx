import { useCallback, useMemo, useState, type PropsWithChildren } from "react";
import classes from "./MoranaPage.module.css";
import { clsx } from "@root/utils";
import useMoranaAppContext from "@root/core/hooks/useMoranaAppContext";
import type MoranaPageContextType from "@root/types/MoranaPageContextType";
import { MoranaPageContext } from "@root/core/context";
import type { PageStructuralComponentType } from "@root/types/PageStructuralComponentType";
import useRouteContext from "@root/routing/hooks/useRouteContext";

export default function MoranaPage({ children }: PropsWithChildren) {
    const { navAnimationBuilder } = useMoranaAppContext();
    const { classForNavState } = useRouteContext();

    const [
        pageStructuralComponentsRegistry,
        setPageStructuralComponentsRegistry,
    ] = useState<{
        header: boolean;
        content: boolean;
    }>({ header: false, content: false });

    const updatePageStructuralComponentsRegistry = useCallback(
        (type: PageStructuralComponentType, val: boolean) => {
            switch (type) {
                case "content":
                    setPageStructuralComponentsRegistry((current) => {
                        return { ...current, content: val };
                    });
                    return;
                case "header":
                    setPageStructuralComponentsRegistry((current) => {
                        return { ...current, header: val };
                    });
                    return;
                default:
                    return;
            }
        },
        [],
    );

    const shouldAnimatePage = useMemo(() => {
        if (navAnimationBuilder?.animateWholePageOverride) {
            return true;
        }

        if (
            pageStructuralComponentsRegistry.content ||
            pageStructuralComponentsRegistry.header
        ) {
            return false;
        }

        return true;
    }, [pageStructuralComponentsRegistry, navAnimationBuilder]);

    const values: MoranaPageContextType = useMemo(() => {
        return {
            classForNavState,
            pageStructuralComponentsRegistry,
            updatePageStructuralComponentsRegistry,
            shouldAnimatePage,
        };
    }, [
        classForNavState,
        pageStructuralComponentsRegistry,
        updatePageStructuralComponentsRegistry,
        shouldAnimatePage,
    ]);

    return (
        <MoranaPageContext.Provider value={values}>
            <div
                className={clsx(
                    classes.moranaPage,
                    shouldAnimatePage && classForNavState,
                    shouldAnimatePage && navAnimationBuilder?.wrapperClassName,
                )}
            >
                {children}
            </div>
        </MoranaPageContext.Provider>
    );
}
