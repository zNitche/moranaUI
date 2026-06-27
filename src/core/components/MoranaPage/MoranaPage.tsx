import { useCallback, useMemo, useState, type PropsWithChildren } from "react";
import classes from "./MoranaPage.module.css";
import { clsx } from "@root/utils";
import { useRouter } from "@root/routing";
import useMoranaAppContext from "@root/core/hooks/useMoranaAppContext";
import type MoranaPageContextType from "@root/types/MoranaPageContextType";
import { MoranaPageContext } from "@root/core/context";

export default function MoranaPage({ children }: PropsWithChildren) {
    const { router } = useRouter();
    const { navAnimationBuilder } = useMoranaAppContext();

    const [
        pageStructuralComponentsRegistry,
        setPageStructuralComponentsRegistry,
    ] = useState<{
        header: boolean;
        content: boolean;
    }>({ header: false, content: false });

    const updatePageStructuralComponentsRegistry = useCallback(
        (type: "header" | "content", val: boolean) => {
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

    const classForNavState = useMemo(() => {
        if (!router?.navigationState) {
            return undefined;
        }

        switch (router?.navigationState) {
            case "in":
                return navAnimationBuilder?.enterAnimation;

            case "out":
                return navAnimationBuilder?.exitAnimation;

            default:
                return undefined;
        }
    }, [router?.navigationState, navAnimationBuilder]);

    const shouldAnimatePage = useMemo(() => {
        if (
            pageStructuralComponentsRegistry.content ||
            pageStructuralComponentsRegistry.header
        ) {
            return false;
        }

        return true;
    }, [pageStructuralComponentsRegistry]);

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
