import { useMemo, type PropsWithChildren } from "react";
import classes from "./MoranaPage.module.css";
import { clsx } from "@root/utils";
import { useRouter } from "@root/routing";

export default function MoranaPage({ children }: PropsWithChildren) {
    const { router } = useRouter();

    const classForNavState = useMemo(() => {
        if (!router?.navigationState) {
            return undefined;
        }

        switch (router?.navigationState) {
            case "in":
                return classes.fadeIn;

            case "out":
                return classes.fadeOut;

            default:
                return undefined;
        }
    }, [router?.navigationState]);

    return (
        <div className={clsx(classes.moranaPage, classForNavState)}>
            {children}
        </div>
    );
}
