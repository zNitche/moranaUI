import type NavAnimationBuilder from "#root/types/NavAnimationBuilder";
import classes from "./defaults.module.css";

export const defaultSlideNavAnimationBuilder: NavAnimationBuilder = {
    route: {
        wrapperClassName: classes.slide,
    },
};
