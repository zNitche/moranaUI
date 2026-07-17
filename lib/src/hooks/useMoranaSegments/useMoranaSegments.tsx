import MoranaSegmentsBar from "@root/components/MoranaSegmentsBar/MoranaSegmentsBar";
import useRouterContext from "@root/routing/hooks/useRouterContext";
import useSearchParams from "@root/routing/hooks/useSearchParams";
import type MoranaSegment from "@root/types/MoranaSegment";
import type MoranaSegmentItem from "@root/types/MoranaSegmentItem";
import type SegmentsBarStylebook from "@root/types/SegmentsBarStylebook";
import { useCallback, useEffect, useMemo, useState } from "react";
import TabComponentWrapper from "./TabComponentWrapper/TabComponentWrapper";

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

    const [activeSegment, setActiveSegment] =
        useState<MoranaSegmentItem | null>(null);

    const urlParamNameSafe = urlParamName ?? "tab";
    const searchParams = useSearchParams<{ [urlParamNameSafe]: string }>();

    const segmentsItems = useMemo(
        () => segments.map((e) => e.details),
        [segments],
    );

    const getInitialActiveSegment = useCallback(() => {
        if (segmentsItems.length === 0) {
            return null;
        }

        if (!searchParams) {
            return null;
        }

        if (!urlParamName || !searchParams[urlParamNameSafe]) {
            return null;
        }

        return (
            segmentsItems.find(
                (s) => s.name === searchParams[urlParamNameSafe],
            ) ?? null
        );
    }, [searchParams, segmentsItems, urlParamName, urlParamNameSafe]);

    useEffect(() => {
        if (activeSegment !== null) {
            return;
        }

        if (searchParams?.[urlParamNameSafe]) {
            const initialSegment = getInitialActiveSegment();

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveSegment(initialSegment);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getInitialActiveSegment, searchParams, urlParamNameSafe]);

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
            onChangeHandler?.(activeSegment);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSegment]);

    const segmentsBar = useMemo(() => {
        return (
            <MoranaSegmentsBar
                segments={segmentsItems}
                activeSegment={activeSegment}
                setActiveSegment={setActiveSegment}
                disabled={disabled}
                stylebook={segmentsBarStylebook}
            />
        );
    }, [activeSegment, disabled, segmentsBarStylebook, segmentsItems]);

    const segmentComponent = useMemo(() => {
        const Component = segments.find(
            (s) => s.details.name === activeSegment?.name,
        )?.component;

        if (animatedTabChange) {
            return (
                <TabComponentWrapper
                    className={segmentComponentWrapperClassName}
                >
                    {Component ? <Component /> : <></>}
                </TabComponentWrapper>
            );
        } else {
            return Component ? <Component /> : <></>;
        }
    }, [
        activeSegment?.name,
        animatedTabChange,
        segmentComponentWrapperClassName,
        segments,
    ]);

    return { segmentsBar, segmentComponent };
}
