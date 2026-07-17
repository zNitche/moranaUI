import {
    useRouter,
    buildUrl,
    useMoranaPageEnter,
    useMoranaPageExit,
    MoranaPage,
    useIsPageActive,
    MoranaHeader,
    MoranaContent,
    useMoranaSegments,
} from "moranaui";
import classes from "./HomePage.module.css";
import { useEffect } from "react";
import Content from "@root/components/Content/Content";
import Header from "@root/components/Header/Header";
import Tab1 from "./Tabs/Tab1";
import Tab2 from "./Tabs/Tab2";
import Tab3 from "./Tabs/Tab3";

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

    const { segmentsBar, segmentsContent } = useMoranaSegments({
        trackPersitance: true,
        urlParamName: "tab",
        segments: [
            { details: { name: "tab1" }, component: Tab1 },
            { details: { name: "tab2222" }, component: Tab2 },
            { details: { name: "tab3" }, component: Tab3 },
        ],
    });

    return (
        <MoranaPage>
            <MoranaHeader>
                <Header title="Home" />
            </MoranaHeader>
            <MoranaContent>
                <Content>
                    <div className={classes.homePage}>
                        {segmentsBar}
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
                        {segmentsContent}
                    </div>
                </Content>
            </MoranaContent>
        </MoranaPage>
    );
}
