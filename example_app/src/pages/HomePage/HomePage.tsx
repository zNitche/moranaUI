import {
    MoranaPage,
    MoranaHeader,
    MoranaContent,
    useMoranaSegments,
} from "moranaui";
import classes from "./HomePage.module.css";
import Content from "@root/components/Content/Content";
import Header from "@root/components/Header/Header";
import MotivationTab from "./Tabs/MotivationTab/MotivationTab";
import FeaturesTab from "./Tabs/FeaturesTab/FeaturesTab";
import AboutTab from "./Tabs/AboutTab/AboutTab";

export default function HomePage() {
    const { segmentsBar, segmentsContent } = useMoranaSegments({
        trackPersitance: true,
        urlParamName: "tab",
        segmentsBarStylebook: {
            segment: {
                base: classes.segmentsBarBase,
                active: classes.active,
            },
        },
        segments: [
            { details: { name: "Motivation" }, component: MotivationTab },
            { details: { name: "Features" }, component: FeaturesTab },
            { details: { name: "About" }, component: AboutTab },
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
                <Content className={classes.homePage}>
                    <div className={classes.segmentsBar}>{segmentsBar}</div>
                    <div className={classes.content}>{segmentsContent}</div>
                </Content>
            </MoranaContent>
        </MoranaPage>
    );
}
