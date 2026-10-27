import type React from "react";

export interface MoranaSegmentItem {
    label: string;
    id: string;
    disabled?: boolean;
}

export default interface MoranaSegment {
    details: MoranaSegmentItem;
    component?: React.ElementType;
}
