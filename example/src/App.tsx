import "./index.css";
import "moranaui/styles.css";
import { Router, Route } from "moranaui";
import HomePage from "./pages/HomePage/HomePage";
import AboutPage from "./pages/AboutPage/AboutPage";
import CatchAllPage from "./pages/CatchAllPage/CatchAllPage";
import CatchAllWrapper from "./wrappers/CatchAllWrapper";

export default function App() {
    return (
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
                component={AboutPage}
            />
            <Route
                url="*"
                wrapper={CatchAllWrapper}
                component={CatchAllPage}
            />
        </Router>
    );
}
