import "./index.css"
import "moranaui/styles.css";
import { Router, Route } from "moranaui";
import HomePage from "./pages/HomePage/HomePage";
import AboutPage from "./pages/AboutPage/AboutPage";
import CatchAllPage from "./pages/CatchAllPage/CatchAllPage";

export default function App() {
    return (
        <Router>
            <Route url={"/"} component={HomePage} />
            <Route url={"/about"} component={AboutPage} />
            <Route component={CatchAllPage} />
        </Router>
    )
}
