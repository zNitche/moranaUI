import {
    MoranaPage,
    MoranaHeader,
    MoranaContent,
    useMoranaSegments,
} from "moranaui";
import classes from "./HomePage.module.css";
import Content from "#root/components/Content/Content";
import Header from "#root/components/Header/Header";
import MotivationTab from "./Tabs/MotivationTab/MotivationTab";
import FeaturesTab from "./Tabs/FeaturesTab/FeaturesTab";
import AboutTab from "./Tabs/AboutTab/AboutTab";
import ExtraTab from "./Tabs/ExtraTab/ExtraTab";
import { usePullToRefresh } from "moranaui";
import { sleep } from "moranaui";

export default function HomePage() {
    const {
        setScrollableContainerRef: setPullToRefreshElementRef,
        RefresherComponent,
    } = usePullToRefresh({
        callback: async () => await sleep(2000),
    });

    const { segmentsBar, segmentsContent } = useMoranaSegments({
        trackPersitance: true,
        urlParamName: "tab",
        className: classes.segmentsBar,
        segments: [
            { details: { name: "Motivation" }, component: MotivationTab },
            { details: { name: "Features" }, component: FeaturesTab },
            { details: { name: "About" }, component: AboutTab },
            { details: { name: "Extra Tab1" }, component: ExtraTab },
            { details: { name: "Extra Tab2" }, component: ExtraTab },
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
