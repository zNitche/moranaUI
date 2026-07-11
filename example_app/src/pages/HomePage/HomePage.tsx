import {
    useRouter,
    buildUrl,
    useMoranaPageEnter,
    useMoranaPageExit,
    MoranaPage,
    useIsPageActive,
    MoranaHeader,
    MoranaContent,
} from "moranaui";
import classes from "./HomePage.module.css";
import { useEffect } from "react";
import Content from "@root/components/Content/Content";
import Header from "@root/components/Header/Header";

export default function HomePage() {
    const { navigateTo, clearRouterCache, getRouteUUIDByName } = useRouter();
    const isPageActive = useIsPageActive();

    console.log(`is home active: ${isPageActive}`);
    console.log(`current route UUID: ${getRouteUUIDByName("home")}`);

    useEffect(() => {
        console.log("home mount");

        return () => {
            console.log("home unmount");
        };
    }, []);

    useMoranaPageEnter({ callback: () => console.log("home page enter") });
    useMoranaPageExit({ callback: () => console.log("home page exit") });

    return (
        <MoranaPage>
            <MoranaHeader>
                <Header title="Home" />
            </MoranaHeader>
            <MoranaContent>
                <Content>
                    <div className={classes.homePage}>
                        <div
                            onClick={() =>
                                navigateTo({
                                    path: "/about",
                                    direction: "forward",
                                })
                            }
                        >
                            nav to about
                        </div>
                        <div
                            onClick={() =>
                                navigateTo({
                                    path: buildUrl(
                                        "/test/idhere/param/where/qhere/pass",
                                        {
                                            q1: "param",
                                            q2: ["test", "1"],
                                        },
                                    ),
                                })
                            }
                        >
                            nav to params
                        </div>
                        <div onClick={clearRouterCache}>Clear router cache</div>
                    </div>
                </Content>
            </MoranaContent>
        </MoranaPage>
    );
}
