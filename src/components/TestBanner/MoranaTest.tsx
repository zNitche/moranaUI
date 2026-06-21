import classes from "./MoranaTest.module.css";

interface MoranaTestProps {
    readonly text: string;
}

export default function MoranaTest({ text }: MoranaTestProps) {
    return <div className={classes.moranaTest}>Hello {text}</div>;
}
