import { useLayoutEffect } from "react";
import useMoranaPageContext from "./useMoranaPageContext";
import type { PageStructuralComponentType } from "@root/types/PageStructuralComponentType";

interface RegisterPageComponentProps {
    readonly componentType: PageStructuralComponentType;
}

export default function useRegisterPageComponent({
    componentType,
}: RegisterPageComponentProps) {
    const { updatePageStructuralComponentsRegistry } = useMoranaPageContext();

    useLayoutEffect(() => {
        updatePageStructuralComponentsRegistry(componentType, true);

        return () =>
            updatePageStructuralComponentsRegistry(componentType, false);
    }, []);
}
