import { MoranaPageContext } from "@root/core/context";
import { useContext } from "react";

export default function useMoranaPageContext() {
    const context = useContext(MoranaPageContext);

    if (!context) {
        throw new Error(
            "useMoranaPageContext can't be called outside MoranaPage context",
        );
    }

    return context;
}
