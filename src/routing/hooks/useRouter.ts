import { useContext } from "react";
import { RouterContext } from "../context";

export default function useRouter() {
    const context = useContext(RouterContext)

    if (!context) {
        throw new Error("useRouter can't be called outside Router's context")
    }

    return context;
}