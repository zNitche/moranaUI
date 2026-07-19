import { MoranaDrawer } from "moranaui";
import type { Dispatch, SetStateAction } from "react";
import classes from "./Drawer.module.css";
import CloseIcon from "@root/icons/CloseIcon";

interface DrawerProps {
    readonly isOpen: boolean;
    readonly setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Drawer({ isOpen, setIsOpen }: DrawerProps) {
    return (
        <MoranaDrawer
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            contentWrapperClassName={classes.drawerWrapper}
        >
            <div className={classes.drawer}>
                <div className={classes.header}>
                    <span>MoranaDrawer</span>
                    <CloseIcon onClick={() => setIsOpen(false)} />
                </div>
                <div className={classes.content}>
                    <span>This is MoranaDrawer.</span>
                    <span>click outside or on close icon to close.</span>
                </div>
            </div>
        </MoranaDrawer>
    );
}
