import {
    useRouter,
    useMoranaPageEnter,
    useMoranaPageExit,
    MoranaPage,
    MoranaHeader,
    MoranaContent,
    useTrackScrollProgress,
    sleep,
    usePullToRefresh,
    useResetContentScroll,
    useMoranaPageRender,
} from "moranaui";
import Header from "#root/components/Header/Header";
import Content from "#root/components/Content/Content";
import { useCallback, useState } from "react";
import classes from "./CollectionPage.module.css";
import Modal from "#root/components/Modal/Modal";
import Drawer from "#root/components/Drawer/Drawer";
import FullScreenOverlay from "#root/components/FullScreenOverlay/FullScreenOverlay";

export default function CollectionPage() {
    const { navigateBack } = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // const isPageActive = useIsPageActive();

    const { setRef } = useTrackScrollProgress();

    const {
        setScrollableContainerRef: setPullToRefreshElementRef,
        RefresherComponent,
    } = usePullToRefresh({
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

    useMoranaPageEnter({
        callback: () => {
            console.log("collection page enter");

            setTimeout(() => resetScroll(), 1000);
        },
    });
    useMoranaPageExit({
        callback: () => {
            console.log("collection page exit");
        },
    });

    useMoranaPageRender({
        onMountCallback: () => console.log("collection page mount"),
        onUnmountCallback: () => console.log("collection page unmount"),
    });

    return (
        <MoranaPage>
            <MoranaHeader>
                <Header
                    title="Collection"
                    onClickBack={() => navigateBack({ popFromCache: false })}
                />
            </MoranaHeader>
            <MoranaContent>
                <Content
                    ref={setContentRef}
                    className={classes.collectionPage}
                >
                    {RefresherComponent}

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
                    <div>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum. Lorem ipsum dolor sit amet,
                        consectetur adipiscing elit. Sed do eiusmod tempor
                        incididunt ut labore et dolore magna aliqua. Ut enim ad
                        minim veniam, quis nostrud exercitation ullamco laboris
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure
                        dolor in reprehenderit in voluptate velit esse cillum
                        dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                        cupidatat non proident, sunt in culpa qui officia
                        deserunt mollit anim id est laborum. Lorem ipsum dolor
                        sit amet, consectetur adipiscing elit. Sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut
                        enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat. Duis
                        aute irure dolor in reprehenderit in voluptate velit
                        esse cillum dolore eu fugiat nulla pariatur. Excepteur
                        sint occaecat cupidatat non proident, sunt in culpa qui
                        officia deserunt mollit anim id est laborum.
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
