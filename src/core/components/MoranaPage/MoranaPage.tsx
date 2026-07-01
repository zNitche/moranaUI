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
import useMoranaAppContext from "@root/core/hooks/useMoranaAppContext";
import useRouterContext from "@root/routing/hooks/useRouterContext";

export default function MoranaPage({ children }: PropsWithChildren) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    const { navAnimationBuilder } = useMoranaAppContext();
    const { router } = useRouterContext();

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

    useLayoutEffect(() => {
        const navigationState = router?.navigationState;

        if (!navigationState?.target) {
            return;
        }

        if (!wrapperRef?.current) {
            return;
        }

        if (navigationState.type === "exit") {
            if (pageStructuralComponentsRegistry?.content) {
                navAnimationBuilder?.page?.onExitAnimation?.(
                    pageStructuralComponentsRegistry?.content,
                );
            }

            if (pageStructuralComponentsRegistry?.header) {
                navAnimationBuilder?.page?.onExitAnimation?.(
                    pageStructuralComponentsRegistry?.header,
                );
            }
        } else {
            if (pageStructuralComponentsRegistry?.content) {
                navAnimationBuilder?.page?.onEnterAnimation?.(
                    pageStructuralComponentsRegistry?.content,
                );
            }

            if (pageStructuralComponentsRegistry?.header) {
                navAnimationBuilder?.page?.onEnterAnimation?.(
                    pageStructuralComponentsRegistry?.header,
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router?.navigationState]);

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
