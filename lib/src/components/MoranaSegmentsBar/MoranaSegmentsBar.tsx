/* eslint-disable react-hooks/refs */
import classes from "./MoranaSegmentsBar.module.css";
import clsx from "#root/utils/clsx";
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
} from "react";
import type { MoranaSegmentItem } from "#root/types/MoranaSegment";

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
        { segment: MoranaSegmentItem; ref: HTMLElement | null }[]
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
            (s) => s.segment.id === activeSegment.id,
        );

        if (!activeElement?.ref) {
            return;
        }

        return {
            ref: activeElement.ref,
            boundingClientRect: activeElement.ref.getBoundingClientRect(),
        };
    }, [activeSegment, segmentsElements]);

    const __scrollToSegment = useCallback(
        (segment: MoranaSegmentItem) => {
            const segmentRef = segmentsElements.find(
                (s) => s.segment.id === segment.id,
            );

            if (!segmentRef?.ref) {
                return;
            }

            const segmentBoundingRect = segmentRef.ref.getBoundingClientRect();
            const barBoundingRect = barRef.current?.getBoundingClientRect();

            if (!barBoundingRect || !barRef.current) {
                return;
            }

            const segmentHalfWidth = segmentBoundingRect.width / 2;
            const segmentBarHalfWidth = barRef.current.clientWidth / 2;

            const segmentCenter =
                segmentBoundingRect.left -
                barBoundingRect.left +
                segmentHalfWidth;

            const scrollLeftVal =
                barRef.current.scrollLeft + segmentCenter - segmentBarHalfWidth;

            barRef.current.scrollTo({
                left: scrollLeftVal,
                behavior: "smooth",
            });
        },
        [segmentsElements],
    );

    const __onSegmentClick = useCallback(
        (
            _event: React.MouseEvent<HTMLDivElement>,
            segment: MoranaSegmentItem,
        ) => {
            if (segment.disabled || activeSegment?.id === segment.id) {
                return;
            }

            setActiveSegment(segment);
        },
        [activeSegment?.id, setActiveSegment],
    );

    const elements = useMemo(() => {
        return segments.map((segment) => {
            return (
                <div
                    ref={(elem: HTMLElement | null) => {
                        setSegmentsElements((current) => {
                            if (
                                current.find((e) => e.segment.id === segment.id)
                            ) {
                                return current;
                            }

                            return [...current, { segment, ref: elem }];
                        });
                    }}
                    onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                        __onSegmentClick(event, segment);
                    }}
                    key={segment.id}
                    className={clsx(
                        classes.segment,
                        segment.disabled && classes.disabled,
                        Boolean(segment.id === activeSegment?.id) &&
                            classes.active,
                    )}
                >
                    {segment.label}
                </div>
            );
        });
    }, [segments, activeSegment, __onSegmentClick]);

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

    useEffect(() => {
        if (!activeSegment) {
            return;
        }

        __scrollToSegment(activeSegment);
    }, [__scrollToSegment, activeSegment]);

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
