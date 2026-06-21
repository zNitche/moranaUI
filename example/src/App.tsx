import "./index.css"
import "moranaui/styles.css";
import { Router, Route } from "moranaui";
import HomePage from "./pages/HomePage/HomePage";
import AboutPage from "./pages/AboutPage/AboutPage";

export default function App() {
    return (
        <Router>
            <Route url={"/home"} component={HomePage} />
            <Route url={"/about"} component={AboutPage} />
        </Router>
    )
}
