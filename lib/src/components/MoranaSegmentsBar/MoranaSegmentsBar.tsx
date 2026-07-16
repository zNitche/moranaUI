import type MoranaSegmentItem from "@root/types/MoranaSegmentItem";
import classes from "./MoranaSegmentsBar.module.css";
import clsx from "@root/utils/clsx";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

interface MoranaSegmentsBarProps {
    readonly segments: MoranaSegmentItem[];
    readonly onSegmentChange?: (target: MoranaSegmentItem) => void;
    readonly disabled?: boolean;
    readonly className?: string;
    readonly segmentClassName?: string;
    readonly selectorClassName?: string;
}

export default function MoranaSegmentsBar({
    segments,
    onSegmentChange,
    disabled,
    className,
    segmentClassName,
    selectorClassName,
}: MoranaSegmentsBarProps) {
    const [activeSegment, setActiveSegment] =
        useState<MoranaSegmentItem | null>(segments.at(0) ?? null);

    const [selectorElement, setSelectorElement] = useState<HTMLElement | null>(
        null,
    );

    const [segmentsElements, setSegmentsElements] = useState<
        { name: string; ref: HTMLElement | null }[]
    >([]);

    const activeSegmentElement = useMemo(() => {
        if (!activeSegment) {
            return;
        }

        const activeElement = segmentsElements.find(
            (s) => s.name === activeSegment.name,
        );

        return activeElement?.ref;
    }, [activeSegment, segmentsElements]);

    useEffect(() => {
        if (activeSegment) {
            onSegmentChange?.(activeSegment);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSegment]);

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
                        if (!segment.disabled) {
                            setActiveSegment(segment);
                        }
                    }}
                    key={segment.name}
                    className={clsx(
                        classes.segment,
                        segment.disabled && classes.disabled,
                        segment.name === activeSegment?.name && classes.active,
                        segmentClassName,
                    )}
                >
                    {segment.name}
                </div>
            );
        });
    }, [segments, activeSegment?.name, segmentClassName]);

    const selector = useMemo(() => {
        if (!activeSegmentElement) {
            return;
        }

        const selectorElementComputedStyle = selectorElement
            ? window.getComputedStyle(selectorElement)
            : null;

        const selectorPaddingLeft = Number.parseInt(
            selectorElementComputedStyle?.paddingLeft ?? "0",
        );
        const offsetLeft =
            activeSegmentElement.offsetLeft - selectorPaddingLeft;

        return (
            <div
                ref={(e: HTMLElement | null) => setSelectorElement(e)}
                className={clsx(classes.selector, selectorClassName)}
                style={
                    {
                        display: !selectorElementComputedStyle
                            ? "none"
                            : "unset",
                        "--height": `${activeSegmentElement.clientHeight}px`,
                        "--width": `${activeSegmentElement.clientWidth}px`,
                        "--offset-left": `${offsetLeft}px`,
                    } as CSSProperties
                }
            />
        );
    }, [activeSegmentElement, selectorClassName, selectorElement]);

    return (
        <div
            className={clsx(
                classes.moranaSegmentsBar,
                disabled && classes.disabled,
                className,
            )}
        >
            {selector}
            {elements}
        </div>
    );
}
