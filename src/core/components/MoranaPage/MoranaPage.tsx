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
import useDetectTransition from "@root/core/hooks/useDetectTransition";
import useRouteContext from "@root/routing/hooks/useRouteContext";
import useHandleTransitionAnimation from "@root/core/hooks/useHandleTransitionAnimation";
import useMoranaAppContext from "@root/core/hooks/context/useMoranaAppContext";

export default function MoranaPage({ children }: PropsWithChildren) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    const { routeUUID } = useRouteContext();
    const { navAnimationBuilder } = useMoranaAppContext();

    const { transitionDetails } = useDetectTransition(routeUUID);
    const { handleTransitionAnimation } = useHandleTransitionAnimation();

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
        if (!transitionDetails.detected) {
            return;
        }

        void handleTransitionAnimation({
            transitionDetails: transitionDetails,
            onAnimationCleanup: navAnimationBuilder?.page?.onAnimationCleanup,
            onEnterAnimation: navAnimationBuilder?.page?.onEnterAnimation,
            onExitAnimation: navAnimationBuilder?.page?.onExitAnimation,
            wrapperRef: wrapperRef,
        });
    }, [
        handleTransitionAnimation,
        navAnimationBuilder?.page,
        transitionDetails,
        transitionDetails.detected,
        transitionDetails.isCurrentlyEntering,
    ]);

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
