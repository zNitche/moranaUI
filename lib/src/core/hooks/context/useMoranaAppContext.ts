import { MoranaAppContext } from "@root/core/context";
import { useContext } from "react";

export default function useMoranaAppContext() {
    const context = useContext(MoranaAppContext);

    if (!context) {
        throw new Error(
            "useMoranaAppContext can't be called outside MoranaApp context",
        );
    }

    return context;
}
