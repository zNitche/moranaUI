import "./index.css";
import "moranaui/styles.css";
import {
    Router,
    Route,
    MoranaApp,
    MoranaRoutesWrapper,
} from "moranaui";
import HomePage from "./pages/HomePage/HomePage";
import CollectionPage from "./pages/CollectionPage/CollectionPage";
import CatchAllPage from "./pages/CatchAllPage/CatchAllPage";
import CatchAllWrapper from "./wrappers/CatchAllWrapper";
import NavigationBar from "./components/NavigationBar/NavigationBar";

export default function App() {
    return (
        <MoranaApp>
            <Router>
                <MoranaRoutesWrapper>
                    <Route
                        url={"/"}
                        component={HomePage}
                        name={"home"}
                    />
                    <Route
                        url={"/collection"}
                        component={CollectionPage}
                        name={"collection"}
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
