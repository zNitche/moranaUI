import Content from "#root/components/Content/Content";
import {
    MoranaContent,
    MoranaPage,
    useMoranaPageLifecycle,
    useRouter,
} from "moranaui";
import classes from "./CatchAllPage.module.css";

export default function CatchAppPage() {
    const { navigateTo } = useRouter();

    useMoranaPageLifecycle({
        onMountCallback: () => {
            console.log("404 mount");
        },
        onUnmountCallback: () => {
            console.log("404 unmount");
        }
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
