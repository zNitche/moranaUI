import { useLayoutEffect, type RefObject } from "react";
import type { PageStructuralComponentType } from "@root/types/PageStructuralComponentType";
import useMoranaPageContext from "./context/useMoranaPageContext";

interface RegisterPageComponentProps {
    readonly componentType: PageStructuralComponentType;
    readonly componentRef: RefObject<HTMLDivElement | null>;
}

export default function useRegisterPageComponent({
    componentType,
    componentRef,
}: RegisterPageComponentProps) {
    const { updatePageStructuralComponentsRegistry } = useMoranaPageContext();

    useLayoutEffect(() => {
        updatePageStructuralComponentsRegistry(componentType, componentRef);

        return () =>
            updatePageStructuralComponentsRegistry(componentType, componentRef);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [componentRef]);
}
