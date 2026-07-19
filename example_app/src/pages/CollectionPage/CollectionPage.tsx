import {
    useRouter,
    useMoranaPageEnter,
    useMoranaPageExit,
    MoranaPage,
    useIsPageActive,
    MoranaHeader,
    MoranaContent,
    useTrackScrollProgress,
    sleep,
    usePullToRefresh,
    useResetContentScroll,
} from "moranaui";
import Header from "@root/components/Header/Header";
import Content from "@root/components/Content/Content";
import { useCallback, useState } from "react";
import classes from "./CollectionPage.module.css";
import Modal from "@root/components/Modal/Modal";
import Drawer from "@root/components/Drawer/Drawer";
import FullScreenOverlay from "@root/components/FullScreenOverlay/FullScreenOverlay";

export default function CollectionPage() {
    const { navigateBack } = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const isPageActive = useIsPageActive();

    const { setRef } = useTrackScrollProgress();

    const { setRef: setPullToRefreshElementRef, refresherAnchor } =
        usePullToRefresh({
            callback: async () => await sleep(3000),
        });

    const { resetScroll, setContentElementRef } = useResetContentScroll();

    const setContentRef = useCallback(
        (elem: HTMLElement | null) => {
            setRef(elem);
            setPullToRefreshElementRef(elem);
            setContentElementRef(elem);
        },
        [setPullToRefreshElementRef, setRef, setContentElementRef],
    );

    console.log(`is about active: ${isPageActive}`);

    useMoranaPageEnter({
        callback: () => {
            console.log("about page enter");

            setTimeout(() => resetScroll(), 1000);
        },
    });
    useMoranaPageExit({ callback: () => console.log("about page exit") });

    return (
        <MoranaPage>
            <MoranaHeader>
                <Header
                    title="Collection"
                    onClickBack={navigateBack}
                />
            </MoranaHeader>
            <MoranaContent>
                <Content
                    ref={setContentRef}
                    className={classes.collectionPage}
                >
                    {refresherAnchor}

                    <div>Pull to refresh</div>

                    <div onClick={() => setIsModalOpen((current) => !current)}>
                        Show Modal
                    </div>
                    <div
                        onClick={() => setIsOverlayOpen((current) => !current)}
                    >
                        Show FullScreenOverlay
                    </div>
                    <div onClick={() => setIsDrawerOpen((current) => !current)}>
                        Show Drawer
                    </div>
                </Content>
            </MoranaContent>

            <FullScreenOverlay
                isOpen={isOverlayOpen}
                setIsOpen={setIsOverlayOpen}
            />

            <Modal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
            />

            <Drawer
                isOpen={isDrawerOpen}
                setIsOpen={setIsDrawerOpen}
            />
        </MoranaPage>
    );
}
