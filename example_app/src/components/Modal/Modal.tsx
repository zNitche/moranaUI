import { MoranaModal } from "moranaui";
import type { Dispatch, SetStateAction } from "react";
import classes from "./Modal.module.css";
import CloseIcon from "@root/icons/CloseIcon";

interface ModalProps {
    readonly isOpen: boolean;
    readonly setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Modal({ isOpen, setIsOpen }: ModalProps) {
    return (
        <MoranaModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            contentWrapperClassName={classes.modalWrapper}
        >
            <div className={classes.modal}>
                <div className={classes.header}>
                    <span>MoranaModal</span>
                    <CloseIcon onClick={() => setIsOpen(false)} />
                </div>
                <div className={classes.content}>
                    <span>This is MoranaModal.</span>
                    <span>click outside or on close icon to close.</span>
                </div>
            </div>
        </MoranaModal>
    );
}
