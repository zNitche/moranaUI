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
        <MoranaToolbar className={classes.header}>
            {onClickBack && <ArrowBackIcon onClick={onClickBack} />}
            <div
                className={clsx(
                    classes.title,
                    centeredTitle && classes.centered,
                )}
            >
                {title}
            </div>
        </MoranaToolbar>
    );
}
