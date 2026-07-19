/* eslint-disable react-hooks/refs */
import type MoranaSegmentItem from "@root/types/MoranaSegmentItem";
import classes from "./MoranaSegmentsBar.module.css";
import clsx from "@root/utils/clsx";
import { useMemo, useRef, useState, type CSSProperties } from "react";
import type SegmentsBarStylebook from "@root/types/SegmentsBarStylebook";

interface MoranaSegmentsBarProps {
    readonly activeSegment: MoranaSegmentItem | null;
    readonly setActiveSegment: (segment: MoranaSegmentItem) => void;
    readonly segments: MoranaSegmentItem[];
    readonly disabled?: boolean;
    readonly stylebook?: SegmentsBarStylebook;
}

export default function MoranaSegmentsBar({
    segments,
    activeSegment,
    setActiveSegment,
    disabled,
    stylebook,
}: MoranaSegmentsBarProps) {
    const barRef = useRef<HTMLDivElement | null>(null);
    const selectorElementRef = useRef<HTMLDivElement | null>(null);

    const [segmentsElements, setSegmentsElements] = useState<
        { name: string; ref: HTMLElement | null }[]
    >([]);

    const barSizeDetails = useMemo(() => {
        if (!barRef.current) {
            return;
        }

        const barStyles = window.getComputedStyle(barRef.current);

        const paddingLeft = parseFloat(barStyles.paddingLeft);
        const paddingRight = parseFloat(barStyles.paddingRight);

        const barWidth = barRef.current.clientWidth;
        const barRawWidth = barWidth - paddingLeft - paddingRight;

        return {
            width: barWidth,
            rawWidth: barRawWidth,
            height: barRef.current.clientHeight,
            elementWidth: barRawWidth / segmentsElements.length,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [segmentsElements.length, window.screen.width]);

    const activeSegmentElement = useMemo(() => {
        if (!activeSegment) {
            return;
        }

        const activeElement = segmentsElements.find(
            (s) => s.name === activeSegment.name,
        );

        return activeElement?.ref;
    }, [activeSegment, segmentsElements]);

    const elements = useMemo(() => {
        return segments.map((segment) => {
            return (
                <div
                    ref={(elem: HTMLElement | null) => {
                        setSegmentsElements((current) => {
                            if (current.find((e) => e.name === segment.name)) {
                                return current;
                            }

                            return [
                                ...current,
                                { name: segment.name, ref: elem },
                            ];
                        });
                    }}
                    onClick={() => {
                        if (
                            !segment.disabled &&
                            (activeSegment?.name !== segment.name)
                        ) {
                            setActiveSegment(segment);
                        }
                    }}
                    key={segment.name}
                    className={clsx(
                        classes.segment,
                        segment.disabled &&
                            (stylebook?.segment?.disabled ?? classes.disabled),
                        segment.name === activeSegment?.name &&
                            (stylebook?.segment?.active ?? classes.active),
                        stylebook?.segment?.base,
                    )}
                >
                    {segment.name}
                </div>
            );
        });
    }, [
        segments,
        stylebook?.segment?.disabled,
        stylebook?.segment?.active,
        stylebook?.segment?.base,
        activeSegment?.name,
        setActiveSegment,
    ]);

    const selectorElementStyle = useMemo(() => {
        if (!activeSegmentElement || !selectorElementRef.current) {
            return;
        }

        const selectorElementComputedStyle = selectorElementRef.current
            ? window.getComputedStyle(selectorElementRef.current)
            : null;

        const paddingLeft = Number.parseInt(
            selectorElementComputedStyle?.paddingLeft ?? "0",
        );
        const offsetLeft = activeSegmentElement.offsetLeft - paddingLeft;

        return {
            paddingLeft,
            offsetLeft,
            height: selectorElementRef.current.clientHeight,
            width: selectorElementRef.current.clientWidth,
        };
    }, [activeSegmentElement, selectorElementRef]);

    return (
        <div
            className={clsx(
                classes.moranaSegmentsBar,
                disabled && (stylebook?.wrapper?.disabled ?? classes.disabled),
                stylebook?.wrapper?.base,
            )}
            ref={barRef}
        >
            <div
                ref={selectorElementRef}
                className={clsx(classes.selector, stylebook?.selector?.base)}
                style={
                    {
                        display:
                            !selectorElementStyle || !barSizeDetails
                                ? "none"
                                : "block",
                        "--height": `${barSizeDetails?.height}px`,
                        "--width": `${barSizeDetails?.elementWidth}px`,
                        "--offset-left": `${selectorElementStyle?.offsetLeft}px`,
                    } as CSSProperties
                }
            />
            {elements}
        </div>
    );
}
