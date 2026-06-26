import { useContext } from "react";
import { MoranaAppContext } from "../context";

export default function useMoranaAppContext() {
    const context = useContext(MoranaAppContext);

    if (!context) {
        throw new Error(
            "useMoranaAppContext can't be called outside MoranaApp context",
        );
    }

    return context;
}
