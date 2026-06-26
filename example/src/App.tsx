import "./index.css";
import "moranaui/styles.css";
// import classes from "./App.module.css";
import { Router, Route, MoranaApp } from "moranaui";
import HomePage from "./pages/HomePage/HomePage";
import AboutPage from "./pages/AboutPage/AboutPage";
import CatchAllPage from "./pages/CatchAllPage/CatchAllPage";
import CatchAllWrapper from "./wrappers/CatchAllWrapper";
import ParamsPage from "./pages/ParamsPage/ParamsPage";

export default function App() {
    return (
        <MoranaApp
            // navAnimationBuilder={{
            //     duration: 1000,
            //     wrapperClassName: classes.navWrapper,
            //     enterAnimation: classes.navEnterAnimation,
            //     exitAnimation: classes.navExitAnimation,
            // }}
        >
            <Router>
                <Route
                    url={"/"}
                    component={HomePage}
                />
                <Route
                    url={"/about"}
                    component={AboutPage}
                />
                <Route
                    url={"/test/:id/param/:w/:q/pass"}
                    component={ParamsPage}
                />
                <Route
                    url="*"
                    wrapper={CatchAllWrapper}
                    component={CatchAllPage}
                />
            </Router>
        </MoranaApp>
    );
}
