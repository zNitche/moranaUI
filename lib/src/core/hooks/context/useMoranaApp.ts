import { MoranaAppContext } from "@root/core/context";
import { useContext } from "react";

export default function useMoranaApp() {
    const context = useContext(MoranaAppContext);

    if (!context) {
        throw new Error(
            "useMoranaApp can't be called outside MoranaApp context",
        );
    }

    return {
        isNavbarVisible: context.isNavbarVisible,
        setIsNavbarVisible: context.setIsNavbarVisible,
    };
}
