import {
    useCallback,
    useLayoutEffect,
    useMemo,
    useState,
    type PropsWithChildren,
} from "react";
import classes from "./MoranaPage.module.css";
import { clsx } from "@root/utils";
import { useRouter } from "@root/routing";
import useMoranaAppContext from "@root/core/hooks/useMoranaAppContext";
import type MoranaPageContextType from "@root/types/MoranaPageContextType";
import { MoranaPageContext } from "@root/core/context";
import type { PageStructuralComponentType } from "@root/types/PageStructuralComponentType";

interface MoranaPageProps {
    readonly currentRouteUuid?: string;
}

export default function MoranaPage({
    children,
    currentRouteUuid,
}: PropsWithChildren<MoranaPageProps>) {
    const { router } = useRouter();
    const { navAnimationBuilder } = useMoranaAppContext();

    const [
        pageStructuralComponentsRegistry,
        setPageStructuralComponentsRegistry,
    ] = useState<{
        header: boolean;
        content: boolean;
    }>({ header: false, content: false });

    const [lifecycleHooks, setLifecycleHooks] = useState<
        | {
              onEnter?: () => void;
              onExit?: () => void;
          }
        | undefined
    >(undefined);

    const registerLifecycleHook = useCallback(
        (type: "enter" | "exit", callback: () => void) => {
            switch (type) {
                case "enter":
                    setLifecycleHooks((current) => {
                        return { ...current, onEnter: callback };
                    });
                    return;

                case "exit":
                    setLifecycleHooks((current) => {
                        return { ...current, onExit: callback };
                    });
                    return;

                default:
                    return;
            }
        },
        [],
    );

    useLayoutEffect(() => {
        if (currentRouteUuid !== router.currentRoute?.uuid) {
            return;
        }

        switch (router.navigationState) {
            case "in":
                lifecycleHooks?.onEnter?.();
                return;

            case "out":
                lifecycleHooks?.onExit?.();
                return;

            default:
                return;
        }
    }, [router.navigationState, router.currentRoute?.uuid, currentRouteUuid]);

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
            registerLifecycleHook,
        };
    }, [
        classForNavState,
        pageStructuralComponentsRegistry,
        updatePageStructuralComponentsRegistry,
        shouldAnimatePage,
        registerLifecycleHook,
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
