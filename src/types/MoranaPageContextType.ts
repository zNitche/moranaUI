import type { PageStructuralComponentType } from "./PageStructuralComponentType";

export default interface MoranaPageContextType {
    pageStructuralComponentsRegistry: {
        header: boolean;
        content: boolean;
    };
    updatePageStructuralComponentsRegistry: (
        type: PageStructuralComponentType,
        val: boolean,
    ) => void;
    shouldAnimatePage: boolean;
}
