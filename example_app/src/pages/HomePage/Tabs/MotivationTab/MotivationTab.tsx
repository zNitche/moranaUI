import classes from "./MotivationTab.module.css";

export default function MotivationTab() {
    return (
        <div className={classes.motivationTab}>
            <div>
                Over the last 2 years I worked with a couple React frameworks,
                mainly for mobile PWA apps.
            </div>
            <div>
                Each of them had its pros and cons, but they all had one thing
                in common: they required building a custom abstraction on top to
                archieve the target app requirements
            </div>
            <div>
                So yeah, as every JS dev should, I rolled my own framework to
                fulfill my needs.
            </div>
            <div>
                And here we are, a couple of weeks later. This is an example app
                built on top of the <strong>moranaUI</strong>.
            </div>
        </div>
    );
}
