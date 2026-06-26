import { useMemo, type PropsWithChildren } from "react";
import classes from "./MoranaPage.module.css";
import { clsx } from "@root/utils";
import { useRouter } from "@root/routing";
import useMoranaAppContext from "@root/core/hooks/useMoranaAppContext";

export default function MoranaPage({ children }: PropsWithChildren) {
    const { router } = useRouter();
    const { navAnimationBuilder } = useMoranaAppContext();

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

    return (
        <div
            className={clsx(
                classes.moranaPage,
                classForNavState,
                navAnimationBuilder?.wrapperClassName,
            )}
        >
            {children}
        </div>
    );
}
