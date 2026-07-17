interface SegmentsBarStylebookItem {
    base?: string;
    disabled?: string;
    active?: string;
}

export default interface SegmentsBarStylebook {
    wrapper?: SegmentsBarStylebookItem;
    segment?: SegmentsBarStylebookItem;
    selector?: SegmentsBarStylebookItem;
}
