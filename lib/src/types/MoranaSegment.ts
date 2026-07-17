import type React from "react";
import type MoranaSegmentItem from "./MoranaSegmentItem";

export default interface MoranaSegment {
    details: MoranaSegmentItem;
    component?: React.ElementType;
}
