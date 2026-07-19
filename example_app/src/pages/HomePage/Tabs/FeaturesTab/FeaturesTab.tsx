import { useRouter } from "moranaui";
import classes from "./FeaturesTab.module.css";

export default function FeaturesTab() {
    const { navigateTo } = useRouter();

    return (
        <div className={classes.featuresTab}>
            <ul className={classes.list}>
                <li>Custom built Router with pages caching and transitions.</li>
                <li>Pages lifecycles hooks (onEnter, onLeave).</li>
                <li>Page structural components - Header, Content, Footer.</li>
                <li>FullScreenOverlays, Modals, Drawers generic components.</li>
                <li>
                    Bunch of usefull hooks for detecting various events (drag,
                    overscroll, swipe, etc.).
                </li>
                <li>Pull to refresh.</li>
                <li>Customization via CSS modules.</li>
                <li>Built with minimalism in mind.</li>
                <li>46kB bunlde size (13 kB gzipped).</li>
            </ul>
            <div
                className={classes.section}
                onClick={() => navigateTo({ path: "/collection" })}
            >
                <span>components in action can be viewed </span>
                <span className={classes.anchor}>here</span>
            </div>
        </div>
    );
}
