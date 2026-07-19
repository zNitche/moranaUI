import { MoranaFullScreenOverlay } from "moranaui";
import type { Dispatch, SetStateAction } from "react";
import classes from "./FullScreenOverlay.module.css";
import CloseIcon from "@root/icons/CloseIcon";

interface FullScreenOverlayProps {
    readonly isOpen: boolean;
    readonly setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function FullScreenOverlay({
    isOpen,
    setIsOpen,
}: FullScreenOverlayProps) {
    return (
        <MoranaFullScreenOverlay
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            contentWrapperClassName={classes.fullScreenOverlayWrapper}
        >
            <div className={classes.fullScreenOverlay}>
                <div className={classes.header}>
                    <span>MoranaFullScreenOverlay</span>
                    <CloseIcon onClick={() => setIsOpen(false)} />
                </div>
                <div className={classes.content}>
                    <span>This is FullScreenOverlay.</span>
                    <span>click on close icon to close.</span>
                </div>
            </div>
        </MoranaFullScreenOverlay>
    );
}
