import classes from "./AboutTab.module.css";

export default function AboutTab() {
    return (
        <div className={classes.aboutTab}>
            <ul className={classes.list}>
                <li>
                    <span>Made with {'\u2764\uFE0F'} by </span>
                    <a
                        className={classes.linkAnchor}
                        target="_blank"
                        href="https://github.com/zNitche/moranaUI"
                    >
                        zNitche
                    </a>
                </li>
                <li>Distributed under MIT license</li>
            </ul>
        </div>
    );
}
