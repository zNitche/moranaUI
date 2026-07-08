import { MoranaNavigationBar, useRouter } from "moranaui";
import classes from "./NavigationBar.module.css";

export default function NavigationBar() {
    const { navigateTo } = useRouter();

    return (
        <MoranaNavigationBar className={classes.navigationBar}>
            <div
                className={classes.navItem}
                onClick={() => navigateTo({ path: "/about" })}
            >
                About
            </div>
            <div
                className={classes.navItem}
                onClick={() => navigateTo({ path: "/" })}
            >
                Home
            </div>
            <div
                className={classes.navItem}
                onClick={() => navigateTo({ path: "/more" })}
            >
                More
            </div>
        </MoranaNavigationBar>
    );
}
