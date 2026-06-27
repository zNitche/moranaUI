export default interface MoranaPageContextType {
    classForNavState?: string;
    pageStructuralComponentsRegistry: {
        header: boolean;
        content: boolean;
    };
    updatePageStructuralComponentsRegistry: (
        type: "header" | "content",
        val: boolean,
    ) => void;
    shouldAnimatePage: boolean;
}
