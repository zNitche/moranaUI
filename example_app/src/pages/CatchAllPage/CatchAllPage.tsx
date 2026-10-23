import Content from "#root/components/Content/Content";
import {
    MoranaContent,
    MoranaPage,
    useMoranaApp,
    useMoranaPageEnter,
    useMoranaPageExit,
    useRouter,
} from "moranaui";
import classes from "./CatchAllPage.module.css";

export default function CatchAppPage() {
    const { setIsNavbarVisible } = useMoranaApp();
    const { navigateTo } = useRouter();

    useMoranaPageEnter({
        callback: () => {
            setIsNavbarVisible?.(false);
        },
    });
    useMoranaPageExit({
        callback: () => {
            setIsNavbarVisible?.(true);
        },
    });

    return (
        <MoranaPage>
            <MoranaContent>
                <Content className={classes.catchAllPage}>
                    <div className={classes.header}>404</div>
                    <div className={classes.wrapper}>
                        <span>Oops unknown page</span>
                        <span
                            className={classes.anchor}
                            onClick={() => navigateTo({ path: "/" })}
                        >
                            return
                        </span>
                    </div>
                </Content>
            </MoranaContent>
        </MoranaPage>
    );
}
