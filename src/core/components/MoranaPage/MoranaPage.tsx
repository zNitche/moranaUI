import {
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type PropsWithChildren,
    type RefObject,
} from "react";
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
        header: RefObject<HTMLDivElement | null> | null;
        content: RefObject<HTMLDivElement | null> | null;
    }>({ header: null, content: null });

    const updatePageStructuralComponentsRegistry = useCallback(
        (
            type: PageStructuralComponentType,
            ref: RefObject<HTMLDivElement | null>,
        ) => {
            switch (type) {
                case "content":
                    setPageStructuralComponentsRegistry((current) => {
                        return { ...current, content: ref };
                    });
                    return;
                case "header":
                    setPageStructuralComponentsRegistry((current) => {
                        return { ...current, header: ref };
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
