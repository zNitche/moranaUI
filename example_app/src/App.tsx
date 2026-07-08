import "./index.css";
import "moranaui/styles.css";
import {
    Router,
    Route,
    MoranaApp,
    MoranaRoutesWrapper,
} from "moranaui";
import HomePage from "./pages/HomePage/HomePage";
import AboutPage from "./pages/AboutPage/AboutPage";
import CatchAllPage from "./pages/CatchAllPage/CatchAllPage";
import CatchAllWrapper from "./wrappers/CatchAllWrapper";
import ParamsPage from "./pages/ParamsPage/ParamsPage";
import NavigationBar from "./components/NavigationBar/NavigationBar";

export default function App() {
    return (
        <MoranaApp>
            <Router>
                <MoranaRoutesWrapper>
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
                        cacheable={false}
                        wrapper={CatchAllWrapper}
                        component={CatchAllPage}
                    />
                </MoranaRoutesWrapper>

                <NavigationBar />
            </Router>
        </MoranaApp>
    );
}
