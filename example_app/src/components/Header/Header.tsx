import { MoranaToolbar } from "moranaui";
import classes from "./Header.module.css";

interface HeaderProps {
    readonly title?: string;
}

export default function Header({ title }: HeaderProps) {
    return (
        <MoranaToolbar className={classes.header}>
            <div>{title}</div>
        </MoranaToolbar>
    );
}
