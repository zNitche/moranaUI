import {
    useCallback,
    useMemo,
    useRef,
    useState,
    type PropsWithChildren,
    type RefObject,
} from "react";
import classes from "./MoranaPage.module.css";
import { clsx } from "#root/utils";
import type MoranaPageContextType from "#root/types/MoranaPageContextType";
import { MoranaPageContext } from "#root/core/context";
import type { PageStructuralComponentType } from "#root/types/PageStructuralComponentType";

export default function MoranaPage({ children }: PropsWithChildren) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [
        pageStructuralComponentsRegistry,
        setPageStructuralComponentsRegistry,
    ] = useState<{
        header: RefObject<HTMLDivElement | null> | null;
        content: RefObject<HTMLDivElement | null> | null;
        footer: RefObject<HTMLDivElement | null> | null;
    }>({ header: null, content: null, footer: null });

    const updatePageStructuralComponentsRegistry = useCallback(
        (
            type: PageStructuralComponentType,
            ref: RefObject<HTMLDivElement | null>,
        ) => {
            setPageStructuralComponentsRegistry((current) => {
                return { ...current, [type]: ref };
            });
        },
        [],
    );

    const values: MoranaPageContextType = useMemo(() => {
        return {
            pageStructuralComponentsRegistry,
            updatePageStructuralComponentsRegistry,
        };
    }, [
        pageStructuralComponentsRegistry,
        updatePageStructuralComponentsRegistry,
    ]);

    return (
        <MoranaPageContext.Provider value={values}>
            <div
                ref={wrapperRef}
                className={clsx(classes.moranaPage)}
            >
                {children}
            </div>
        </MoranaPageContext.Provider>
    );
}
