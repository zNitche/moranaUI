import {
    MoranaPage,
    MoranaHeader,
    MoranaContent,
    useMoranaSegments,
    usePullToRefresh,
    sleep,
} from "moranaui";
import classes from "./HomePage.module.css";
import Content from "#root/components/Content/Content";
import Header from "#root/components/Header/Header";
import MotivationTab from "./Tabs/MotivationTab/MotivationTab";
import FeaturesTab from "./Tabs/FeaturesTab/FeaturesTab";
import AboutTab from "./Tabs/AboutTab/AboutTab";
import ExtraTab from "./Tabs/ExtraTab/ExtraTab";

export default function HomePage() {
    const {
        setScrollableContainerRef: setPullToRefreshElementRef,
        RefresherComponent,
    } = usePullToRefresh({
        callback: async () => await sleep(2000),
    });

    const { segmentsBar, segmentsContent } = useMoranaSegments({
        trackPersistence: true,
        urlParamName: "tab",
        className: classes.segmentsBar,
        segments: [
            {
                details: { label: "Motivation", id: "motivation" },
                component: MotivationTab,
            },
            {
                details: { label: "Features", id: "features" },
                component: FeaturesTab,
            },
            {
                details: { label: "About", id: "about" },
                component: AboutTab,
            },
            {
                details: { label: "Extra Tab1", id: "extra_tab1" },
                component: ExtraTab,
            },
            {
                details: { label: "Extra Tab2", id: "extra_tab2" },
                component: ExtraTab,
            },
        ],
    });

    return (
        <MoranaPage>
            <MoranaHeader>
                <Header
                    centeredTitle
                    title="moranaUI"
                />
            </MoranaHeader>
            <MoranaContent>
                {RefresherComponent}
                <Content
                    className={classes.homePage}
                    ref={setPullToRefreshElementRef}
                >
                    <div className={classes.segmentsBar}>{segmentsBar}</div>
                    <div className={classes.content}>{segmentsContent}</div>
                </Content>
            </MoranaContent>
        </MoranaPage>
    );
}
