import { MoranaToolbar, clsx } from "moranaui";
import classes from "./Header.module.css";
import ArrowBackIcon from "@root/icons/ArrowBackIcon";

interface HeaderProps {
    readonly title?: string;
    readonly onClickBack?: () => void;
    readonly centeredTitle?: boolean;
}

export default function Header({
    title,
    onClickBack,
    centeredTitle = false,
}: HeaderProps) {
    return (
        <MoranaToolbar
            className={clsx(classes.header, centeredTitle && classes.centered)}
        >
            {onClickBack && <ArrowBackIcon onClick={onClickBack} />}
            <div className={classes.title}>{title}</div>
        </MoranaToolbar>
    );
}
