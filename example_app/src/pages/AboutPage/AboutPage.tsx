import {
    useRouter,
    useMoranaPageEnter,
    useMoranaPageExit,
    MoranaPage,
    useIsPageActive,
    MoranaHeader,
    MoranaContent,
    MoranaModal,
    MoranaFullScreenOverlay,
    MoranaDrawer,
    useTrackScrollProgress,
    range,
    sleep,
    usePullToRefresh,
} from "moranaui";
import Header from "@root/components/Header/Header";
import Content from "@root/components/Content/Content";
import { useCallback, useState } from "react";

export default function AboutPage() {
    const { navigateTo } = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const isPageActive = useIsPageActive();

    const { setRef } = useTrackScrollProgress();

    const { setRef: setPullToRefreshElementRef, refresherAnchor } =
        usePullToRefresh({
            callback: async () => await sleep(3000),
        });

    const setContentRef = useCallback(
        (elem: HTMLElement | null) => {
            setRef(elem);
            setPullToRefreshElementRef(elem);
        },
        [setPullToRefreshElementRef, setRef],
    );

    // console.log(`is about active: ${isPageActive}`);

    useMoranaPageEnter({ callback: () => console.log("about page enter") });
    useMoranaPageExit({ callback: () => console.log("about page exit") });

    return (
        <MoranaPage>
            <MoranaHeader>
                <Header title="About" />
            </MoranaHeader>
            <MoranaContent>
                <Content ref={setContentRef}>
                    {refresherAnchor}

                    {range(100).map((i) => (
                        <div key={i}>{i}</div>
                    ))}
                    <div
                        onClick={() =>
                            navigateTo({ path: "/", direction: "back" })
                        }
                    >
                        nav to home
                    </div>
                    <div onClick={() => setIsModalOpen((current) => !current)}>
                        toggle modal
                    </div>
                    <div
                        onClick={() => setIsOverlayOpen((current) => !current)}
                    >
                        toggle overlay
                    </div>
                    <div onClick={() => setIsDrawerOpen((current) => !current)}>
                        toggle drawer
                    </div>
                </Content>
            </MoranaContent>

            <MoranaFullScreenOverlay
                isOpen={isOverlayOpen}
                setIsOpen={setIsOverlayOpen}
            >
                test overlay
            </MoranaFullScreenOverlay>

            <MoranaModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
            >
                test modal
            </MoranaModal>

            <MoranaDrawer
                isOpen={isDrawerOpen}
                setIsOpen={setIsDrawerOpen}
            >
                test drawer
            </MoranaDrawer>
        </MoranaPage>
    );
}
