/* eslint-disable react-hooks/refs */
import type MoranaSegmentItem from "#root/types/MoranaSegmentItem";
import classes from "./MoranaSegmentsBar.module.css";
import clsx from "#root/utils/clsx";
import {
    useCallback,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
} from "react";

interface MoranaSegmentsBarProps {
    readonly activeSegment: MoranaSegmentItem | null;
    readonly setActiveSegment: (segment: MoranaSegmentItem) => void;
    readonly segments: MoranaSegmentItem[];
    readonly disabled?: boolean;
    readonly className?: string;
}

export default function MoranaSegmentsBar({
    segments,
    activeSegment,
    setActiveSegment,
    disabled,
    className,
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
            padding: {
                left: paddingLeft,
                right: paddingRight,
            },
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

        if (!activeElement?.ref) {
            return;
        }

        return {
            ref: activeElement.ref,
            boundingClientRect: activeElement.ref.getBoundingClientRect(),
        };
    }, [activeSegment, segmentsElements]);

    const __onSegmentClick = useCallback(
        (
            event: React.MouseEvent<HTMLDivElement>,
            segment: MoranaSegmentItem,
        ) => {
            if (segment.disabled || activeSegment?.name === segment.name) {
                return;
            }

            setActiveSegment(segment);

            const segmentBoundingClientRect =
                event.currentTarget.getBoundingClientRect();
            const barBoundingClientRect =
                barRef.current?.getBoundingClientRect();

            if (!barBoundingClientRect) {
                return;
            }

            let scrollLeftVal = barBoundingClientRect.x - segmentBoundingClientRect.x;

            if (segmentBoundingClientRect.left < barBoundingClientRect.left) {
                scrollLeftVal =
                    segmentBoundingClientRect.left - barBoundingClientRect.left;
            } else if (
                segmentBoundingClientRect.right > barBoundingClientRect.right
            ) {
                scrollLeftVal =
                    segmentBoundingClientRect.right -
                    barBoundingClientRect.right;
            }

            barRef.current?.scrollTo({
                left: scrollLeftVal,
                behavior: "smooth",
            });
        },
        [activeSegment?.name, setActiveSegment],
    );

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
                    onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                        __onSegmentClick(event, segment);
                    }}
                    key={segment.name}
                    className={clsx(
                        classes.segment,
                        segment.disabled && classes.disabled,
                        Boolean(segment.name === activeSegment?.name) &&
                            classes.active,
                    )}
                >
                    {segment.name}
                </div>
            );
        });
    }, [segments, activeSegment?.name, __onSegmentClick]);

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
        const offsetLeft = activeSegmentElement.ref.offsetLeft - paddingLeft;

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
                disabled && classes.disabled,
                className,
            )}
            ref={barRef}
        >
            <div
                ref={selectorElementRef}
                className={classes.selector}
                style={
                    {
                        display:
                            !selectorElementStyle || !barSizeDetails
                                ? "none"
                                : "block",
                        "--height": `${barSizeDetails?.height}px`,
                        "--width": `${activeSegmentElement?.boundingClientRect.width ?? 0}px`,
                        "--offset-left": `${selectorElementStyle?.offsetLeft}px`,
                    } as CSSProperties
                }
            />
            {elements}
        </div>
    );
}
