import type { PageStructuralComponentType } from "./PageStructuralComponentType";

export default interface MoranaPageContextType {
    classForNavState?: string;
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
