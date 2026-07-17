import MoranaSegmentsBar from "@root/components/MoranaSegmentsBar/MoranaSegmentsBar";
import useRouterContext from "@root/routing/hooks/useRouterContext";
import useSearchParams from "@root/routing/hooks/useSearchParams";
import type MoranaSegment from "@root/types/MoranaSegment";
import type MoranaSegmentItem from "@root/types/MoranaSegmentItem";
import type SegmentsBarStylebook from "@root/types/SegmentsBarStylebook";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import TabComponentWrapper from "./TabComponentWrapper/TabComponentWrapper";
import classes from "./useMoranaSegments.module.css";

interface HookUseMoranaSegmentsProps {
    readonly segments: MoranaSegment[];
    readonly trackPersitance?: boolean;
    readonly urlParamName?: string;
    readonly onChange?: (target: MoranaSegmentItem) => void;
    readonly disabled?: boolean;
    readonly segmentsBarStylebook?: SegmentsBarStylebook;
    readonly segmentComponentWrapperClassName?: string;
    readonly animatedTabChange?: boolean;
}

export default function useMoranaSegments({
    segments,
    trackPersitance = true,
    urlParamName,
    disabled = false,
    onChange,
    segmentsBarStylebook,
    segmentComponentWrapperClassName,
    animatedTabChange = true,
}: HookUseMoranaSegmentsProps) {
    const { replaceSearchParams } = useRouterContext();

    const [activeSegment, setActiveSegment] = useState<MoranaSegment | null>(
        null,
    );

    const [segmentsStack, setSegmentsStack] = useState<null | {
        current: MoranaSegment | null;
        previous: MoranaSegment | null;
    }>(null);

    const urlParamNameSafe = urlParamName ?? "tab";
    const searchParams = useSearchParams<{ [urlParamNameSafe]: string }>();

    const segmentsItems = useMemo(
        () => segments.map((e) => e.details),
        [segments],
    );

    const getInitialActiveSegment = useCallback(() => {
        if (segments.length === 0 || !searchParams) {
            return null;
        }

        if (!urlParamName || !urlParamNameSafe) {
            return null;
        }

        return (
            segments.find(
                (s) => s.details.name === searchParams[urlParamNameSafe],
            ) ?? null
        );
    }, [searchParams, segments, urlParamName, urlParamNameSafe]);

    useEffect(() => {
        if (activeSegment !== null) {
            return;
        }

        if (!trackPersitance) {
            return;
        }

        let initialSegment = getInitialActiveSegment();

        if (!searchParams?.[urlParamNameSafe]) {
            initialSegment = segments.at(0) ?? null;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSegmentsStack({ current: initialSegment, previous: null });
        setActiveSegment(initialSegment);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const onChangeHandler = useCallback(
        (s: MoranaSegmentItem) => {
            if (trackPersitance && urlParamName) {
                replaceSearchParams({ add: { [urlParamName]: s.name } });
            }

            onChange?.(s);
        },
        [onChange, replaceSearchParams, trackPersitance, urlParamName],
    );

    useEffect(() => {
        if (activeSegment) {
            onChangeHandler?.(activeSegment.details);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSegment]);

    const onSegmentChange = useCallback(
        (newSegmentDetails: MoranaSegmentItem) => {
            const newSegment =
                segments.find(
                    (s) => s.details.name === newSegmentDetails.name,
                ) ?? null;

            setSegmentsStack({ current: newSegment, previous: activeSegment });
            setActiveSegment(newSegment);
        },
        [activeSegment, segments],
    );

    const segmentsBar = useMemo(() => {
        return (
            <MoranaSegmentsBar
                segments={segmentsItems}
                activeSegment={activeSegment?.details ?? null}
                setActiveSegment={onSegmentChange}
                disabled={disabled}
                stylebook={segmentsBarStylebook}
            />
        );
    }, [
        activeSegment?.details,
        disabled,
        onSegmentChange,
        segmentsBarStylebook,
        segmentsItems,
    ]);

    const segmentsContent = useMemo(() => {
        const ActiveSegmentComponent =
            segmentsStack?.current?.component ?? React.Fragment;

        if (animatedTabChange) {
            if (segmentsStack?.current) {
                const PreviousSegmentComponent =
                    segmentsStack.previous?.component;

                return (
                    <div className={classes.segmentsWrapper}>
                        {PreviousSegmentComponent && (
                            <TabComponentWrapper
                                className={segmentComponentWrapperClassName}
                                isLeaving={true}
                                onAnimationEndCallback={() =>
                                    setSegmentsStack((current) => {
                                        return current
                                            ? { ...current, previous: null }
                                            : null;
                                    })
                                }
                            >
                                <PreviousSegmentComponent />
                            </TabComponentWrapper>
                        )}
                        {!segmentsStack.previous && (
                            <TabComponentWrapper
                                className={segmentComponentWrapperClassName}
                            >
                                <ActiveSegmentComponent />
                            </TabComponentWrapper>
                        )}
                    </div>
                );
            }
        }

        return <ActiveSegmentComponent />;
    }, [animatedTabChange, segmentComponentWrapperClassName, segmentsStack]);

    return { segmentsBar, segmentsContent };
}
