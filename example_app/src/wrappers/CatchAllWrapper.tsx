import { useEffect, type PropsWithChildren } from "react";

export default function CatchAllWrapper({ children }: PropsWithChildren) {
    useEffect(() => {
        console.log("catch all wrapper");
    }, []);

    return children;
}
