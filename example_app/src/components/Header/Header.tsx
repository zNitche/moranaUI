import classes from "./Header.module.css";

interface HeaderProps {
    readonly title?: string;
}

export default function Header({ title }: HeaderProps) {
    return <div className={classes.header}>{title}</div>;
}
