import { useCallback, useMemo, useState, type PropsWithChildren } from "react";
import classes from "./MoranaPage.module.css";
import { clsx } from "@root/utils";
import type MoranaPageContextType from "@root/types/MoranaPageContextType";
import { MoranaPageContext } from "@root/core/context";
import type { PageStructuralComponentType } from "@root/types/PageStructuralComponentType";

export default function MoranaPage({ children }: PropsWithChildren) {
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
            pageStructuralComponentsRegistry,
            updatePageStructuralComponentsRegistry,
            shouldAnimatePage,
        };
    }, [
        pageStructuralComponentsRegistry,
        updatePageStructuralComponentsRegistry,
        shouldAnimatePage,
    ]);

    return (
        <MoranaPageContext.Provider value={values}>
            <div className={clsx(classes.moranaPage)}>{children}</div>
        </MoranaPageContext.Provider>
    );
}
